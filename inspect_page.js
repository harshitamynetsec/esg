import fs from 'fs/promises';
import { PDFDocument } from 'pdf-lib';

async function main() {
  const bytes = await fs.readFile('./REPORT FORMAT April 2026 with SDGs.pdf');
  const pdfDoc = await PDFDocument.load(bytes);
  const pages = pdfDoc.getPages();
  const page = pages[0];
  console.log('Page properties:', Object.getOwnPropertyNames(page));
  console.log('Page proto properties:', Object.getOwnPropertyNames(Object.getPrototypeOf(page)));
}

main().catch(console.error);
