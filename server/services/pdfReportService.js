import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument } from 'pdf-lib';
import { AppError } from '../utils/AppError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_PDF_PATH = path.resolve(__dirname, '../../REPORT FORMAT April 2026 with SDGs.pdf');

const SDG_PAGE_INDEX = {
  '1': 11,
  '2': 12,
  '3': 13,
  '4': 14,
  '5': 15,
  '6': 16,
  '7': 17,
  '8': 18,
  '9': 19,
  '10': 20,
  '11': 21,
  '12': 22,
  '13': 23,
  '14': 24,
  '15': 25,
  '16': 26,
  '17': 27,
};

const KPI_PAGE_CONFIG = [
  { pageIndex: 29, sdgs: ['3', '4', '5', '8', '10'] }, // Page 30
  { pageIndex: 30, sdgs: ['4', '5', '8'] }, // Page 31
  { pageIndex: 31, sdgs: ['12', '13'] }, // Page 32
  { pageIndex: 32, sdgs: ['8', '16', '17'] }, // Page 33
  { pageIndex: 33, sdgs: ['12', '17'] }, // Page 34
];

const ALWAYS_INCLUDED_PAGE_INDICES = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, // Pages 1-11
  28, // Page 29
  34, // Page 35
  35, // Page 36
];

const parseSdgNumber = (value) => {
  if (value == null) return null;
  const raw = String(value).trim();
  const match = raw.match(/(?:SDG\s*[-:]*\s*)?(\d{1,2})$/i);
  if (!match) return null;
  const num = Number(match[1]);
  if (!Number.isInteger(num) || num < 1 || num > 17) return null;
  return String(num);
};

const normalizeSdgValues = (values) =>
  [...new Set((values || []).map(parseSdgNumber).filter(Boolean))];

export const getSelectedReportSdgs = (assessmentResult) => {
  const gapSdgs = normalizeSdgValues(
    (assessmentResult.complianceGaps || []).flatMap((item) => item.sdgs || []),
  );
  const strengthSdgs = normalizeSdgValues(
    (assessmentResult.strengths || []).flatMap((item) => item.sdgs || []),
  );
  const selectedTopicSdgs = normalizeSdgValues(
    (assessmentResult.selectedMaterialTopics || []).flatMap((topic) => topic.sdgs || []),
  );

  const keepSdgs = [
    ...gapSdgs,
    ...selectedTopicSdgs.filter((sdg) => !strengthSdgs.includes(sdg)),
  ];

  return [...new Set(keepSdgs)];
};

const buildSdgPageIndices = (assessmentResult) => {
  const keepSdgs = getSelectedReportSdgs(assessmentResult);

  return [...new Set(keepSdgs)]
    .map((sdg) => SDG_PAGE_INDEX[sdg])
    .filter((index) => typeof index === 'number')
    .sort((a, b) => a - b);
};

const buildKpiPageIndices = (assessmentResult) => {
  const relevantSdgs = normalizeSdgValues([
    ...(assessmentResult.complianceGaps || []).flatMap((item) => item.sdgs || []),
    ...(assessmentResult.selectedMaterialTopics || []).flatMap((topic) => topic.sdgs || []),
  ]);

  return KPI_PAGE_CONFIG.filter((config) =>
    config.sdgs.some((sdg) => relevantSdgs.includes(sdg)),
  ).map((config) => config.pageIndex);
};

export const generateAssessmentPdf = async (assessmentResult) =>
 { if (!assessmentResult || !assessmentResult._id) {
    throw new AppError('Assessment result is required to generate the PDF report', 400, 'INVALID_ASSESSMENT_RESULT');
  }

  const templateBytes = await fs.readFile(TEMPLATE_PDF_PATH).catch((err) => {
    throw new AppError(`Unable to load report template PDF: ${err.message}`, 500, 'PDF_TEMPLATE_MISSING');
  });

  const templatePdf = await PDFDocument.load(templateBytes);
  const newPdf = await PDFDocument.create();

  const sdgPageIndices = buildSdgPageIndices(assessmentResult);
  const kpiPageIndices = buildKpiPageIndices(assessmentResult);
  const pageIndices = [...ALWAYS_INCLUDED_PAGE_INDICES, ...sdgPageIndices, ...kpiPageIndices]
    .sort((a, b) => a - b)
    .filter((value, index, self) => self.indexOf(value) === index);

  if (!pageIndices.length) {
    throw new AppError('No pages were selected for the PDF report', 500, 'PDF_NO_PAGES_SELECTED');
  }

  const pages = await newPdf.copyPages(templatePdf, pageIndices);
  pages.forEach((page) => newPdf.addPage(page));

  return Buffer.from(await newPdf.save());
};


