import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 50;
const MUTED = rgb(0.4, 0.45, 0.5);
const INK = rgb(0.06, 0.09, 0.13);
const ACCENT = rgb(0.059, 0.463, 0.431);

const wrapText = (text, font, size, maxWidth) => {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  });
  if (current) lines.push(current);
  return lines.length ? lines : [''];
};

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : 'N/A');

export const generateManagementReportPdf = async ({ report, kpis = [], policies = [] }) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  const ensureSpace = (needed) => {
    if (y - needed < MARGIN) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    }
  };

  const drawLine = (text, { size = 11, bold = false, color = INK, gap = 16 } = {}) => {
    ensureSpace(gap);
    page.drawText(text, { x: MARGIN, y, size, font: bold ? boldFont : font, color });
    y -= gap;
  };

  const drawWrapped = (text, options = {}) => {
    const { size = 10, gap = 14 } = options;
    wrapText(text, font, size, PAGE_WIDTH - MARGIN * 2).forEach((line) => drawLine(line, { size, gap }));
  };

  drawLine(report.title, { size: 20, bold: true, gap: 26 });
  drawLine(
    `${report.type.replaceAll('_', ' ').toUpperCase()}  •  ${formatDate(report.periodStart)} - ${formatDate(report.periodEnd)}`,
    { size: 11, color: ACCENT, gap: 16 },
  );
  drawLine(`Generated ${new Date(report.createdAt || Date.now()).toLocaleString()}`, { size: 9, color: MUTED, gap: 26 });

  drawLine('Summary', { size: 13, bold: true, gap: 18 });
  drawWrapped(report.summary || 'No summary available.');
  y -= 10;

  drawLine(`KPIs (${kpis.length})`, { size: 13, bold: true, gap: 18 });
  if (kpis.length) {
    kpis.forEach((kpi) => {
      drawWrapped(`${kpi.name} — ${kpi.pillar} — ${kpi.currentValue ?? 0}/${kpi.targetValue ?? 0} ${kpi.unit || ''}`.trim());
    });
  } else {
    drawLine('No KPIs recorded for this organization yet.', { size: 10, color: MUTED });
  }
  y -= 10;

  drawLine(`Policies (${policies.length})`, { size: 13, bold: true, gap: 18 });
  if (policies.length) {
    policies.forEach((policy) => {
      drawWrapped(`${policy.title} — ${policy.status}`);
    });
  } else {
    drawLine('No policies recorded for this organization yet.', { size: 10, color: MUTED });
  }

  return Buffer.from(await pdfDoc.save());
};
