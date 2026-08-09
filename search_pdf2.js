import fs from 'fs/promises';
import { PDFDocument, PDFName } from 'pdf-lib';

async function main() {
  const bytes = await fs.readFile('./REPORT FORMAT April 2026 with SDGs.pdf');
  const pdfDoc = await PDFDocument.load(bytes);
  const count = pdfDoc.getPageCount();
  console.log(`Total pages: ${count}`);
  
  const pages = pdfDoc.getPages();
  for (let i = 0; i < count; i++) {
    const page = pages[i];
    const contents = page.node.get(PDFName.of('Contents'));
    if (!contents) {
      console.log(`Page ${i + 1}: no contents`);
      continue;
    }
    
    const resolved = pdfDoc.context.lookup(contents);
    let text = '';
    
    const decodeStream = (stream) => {
      const resolvedStream = pdfDoc.context.lookup(stream);
      // We know it is a PDFRawStream from our debug script
      if (resolvedStream && typeof resolvedStream.getContentsString === 'function') {
        return resolvedStream.getContentsString();
      }
      return '';
    };

    if (resolved && Array.isArray(resolved.array)) {
      resolved.array.forEach(stream => {
        text += decodeStream(stream);
      });
    } else {
      text += decodeStream(contents);
    }
    
    // Check for SDG mentions (SDG 1 to 17)
    const sdgsFound = [];
    for (let s = 1; s <= 17; s++) {
      const regex = new RegExp(`SDG\\s*[-:]*\\s*${s}\\b`, 'i');
      if (regex.test(text)) {
        sdgsFound.push(s);
      }
    }
    
    // Let's print the page text preview to see if we can identify what is on this page
    // Clean text: strip parenthesis and formatting characters if we want, or just print first 100 characters.
    const cleanText = text.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`Page ${i + 1}: sdgs = [${sdgsFound.join(', ')}], text_preview = "${cleanText.slice(0, 100)}"`);
  }
}

main().catch(console.error);
