import fs from 'fs/promises';
import { PDFDocument } from 'pdf-lib';

async function main() {
  const bytes = await fs.readFile('./REPORT FORMAT April 2026 with SDGs.pdf');
  const pdfDoc = await PDFDocument.load(bytes);
  console.log('Page count:', pdfDoc.getPageCount());
}

main().catch(console.error);
