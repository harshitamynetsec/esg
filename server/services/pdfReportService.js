import fs from 'fs/promises';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { AppError } from '../utils/AppError.js';

const templatePath = './templates/ESG_Report_Base.pdf';

const drawLine = (page, text, x, y, font, size = 10) => {
  page.drawText(String(text), {
    x,
    y,
    size,
    font,
    color: rgb(0.05, 0.09, 0.16),
  });
};

const drawList = (page, items, { x, y, font, maxItems = 8, lineHeight = 16, formatter }) => {
  items.slice(0, maxItems).forEach((item, index) => {
    drawLine(page, formatter(item, index), x, y - index * lineHeight, font, 9);
  });
};

export const generateAssessmentPdf = async (assessmentResult) => {
  let templateBytes;

  try {
    templateBytes = await fs.readFile(path.resolve(templatePath));
  } catch {
    throw new AppError(`PDF template not found at ${templatePath}`, 500, 'PDF_TEMPLATE_MISSING');
  }

  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const firstPage = pages[0];

  if (!firstPage) {
    throw new AppError('PDF template does not contain any pages', 500, 'PDF_TEMPLATE_INVALID');
  }

  const { width, height } = firstPage.getSize();

  firstPage.drawText('ESG Assessment Result', {
    x: 48,
    y: height - 72,
    size: 18,
    font: boldFont,
    color: rgb(0.06, 0.46, 0.43),
  });

  drawLine(firstPage, `Assessment ID: ${assessmentResult._id}`, 48, height - 98, regularFont, 9);
  drawLine(firstPage, `Completed: ${new Date(assessmentResult.completedAt).toLocaleDateString('en-IN')}`, 48, height - 114, regularFont, 9);

  drawLine(firstPage, `Environmental: ${assessmentResult.pillarScores.environmental}%`, 48, height - 150, boldFont, 12);
  drawLine(firstPage, `Social: ${assessmentResult.pillarScores.social}%`, 48, height - 170, boldFont, 12);
  drawLine(firstPage, `Governance: ${assessmentResult.pillarScores.governance}%`, 48, height - 190, boldFont, 12);
  drawLine(firstPage, `Overall: ${assessmentResult.pillarScores.overall}%`, 48, height - 210, boldFont, 12);

  drawLine(firstPage, 'Selected / Prioritized Material Topics', 48, height - 250, boldFont, 12);
  drawList(firstPage, assessmentResult.prioritizedMaterialTopics || [], {
    x: 58,
    y: height - 272,
    font: regularFont,
    formatter: (topic) => `- ${topic.title} (${topic.pillar})`,
  });

  const secondPage = pages[1] || pdfDoc.addPage([width, height]);
  drawLine(secondPage, 'Compliance Gaps', 48, height - 72, boldFont, 14);
  drawList(secondPage, assessmentResult.complianceGaps || [], {
    x: 58,
    y: height - 96,
    font: regularFont,
    maxItems: 12,
    formatter: (gap) => `- ${gap.questionText.slice(0, 90)} | Score: ${gap.selectedValue}`,
  });

  drawLine(secondPage, 'KPIs To Track', 48, height - 310, boldFont, 14);
  drawList(secondPage, assessmentResult.recommendedKpis || [], {
    x: 58,
    y: height - 334,
    font: regularFont,
    maxItems: 14,
    formatter: (kpi) => `- ${kpi.name}${kpi.unit ? ` (${kpi.unit})` : ''}${kpi.sdg ? ` | SDG ${kpi.sdg}` : ''}`,
  });

  return Buffer.from(await pdfDoc.save());
};
