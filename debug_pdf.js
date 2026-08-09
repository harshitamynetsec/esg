import fs from 'fs/promises';
import { PDFDocument, PDFName } from 'pdf-lib';

async function main() {
  const bytes = await fs.readFile('./REPORT FORMAT April 2026 with SDGs.pdf');
  const pdfDoc = await PDFDocument.load(bytes);
  const pages = pdfDoc.getPages();
  const page = pages[0];
  const contents = page.node.get(PDFName.of('Contents'));
  const resolved = pdfDoc.context.lookup(contents);
  
  console.log('Resolved constructor name:', resolved.constructor.name);
  if (Array.isArray(resolved.array)) {
    const firstItem = pdfDoc.context.lookup(resolved.array[0]);
    console.log('First item constructor name:', firstItem.constructor.name);
    console.log('First item prototype keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(firstItem)));
    console.log('First item keys:', Object.keys(firstItem));
  } else {
    console.log('Resolved prototype keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(resolved)));
    console.log('Resolved keys:', Object.keys(resolved));
  }
}

main().catch(console.error);
