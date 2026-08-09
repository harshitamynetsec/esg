import fs from 'fs/promises';
import { PDFDocument, PDFRawStream } from 'pdf-lib';

async function main() {
  const bytes = await fs.readFile('./REPORT FORMAT April 2026 with SDGs.pdf');
  const pdfDoc = await PDFDocument.load(bytes);
  const count = pdfDoc.getPageCount();
  console.log(`PDF loaded. Total pages: ${count}`);
  
  const pages = pdfDoc.getPages();
  for (let i = 0; i < count; i++) {
    const page = pages[i];
    // In pdf-lib, page.node.Contents() returns a PDFArray, a PDFRawStream, or a PDFRef.
    const contentsRef = page.node.get(page.node.context.names.Contents);
    if (!contentsRef) {
      console.log(`Page ${i + 1}: No Contents`);
      continue;
    }
    
    // Resolve references
    const contents = page.node.context.lookup(contentsRef);
    let text = '';
    
    const extractFromStream = (stream) => {
      const resolvedStream = page.node.context.lookup(stream);
      if (resolvedStream instanceof PDFRawStream) {
        const decoded = resolvedStream.decode();
        return new TextDecoder('utf-8').decode(decoded);
      }
      return '';
    };

    if (Array.isArray(contents.array)) {
      contents.array.forEach(stream => {
        text += extractFromStream(stream);
      });
    } else {
      text += extractFromStream(contentsRef);
    }
    
    // Search for SDG 1 to 17
    const sdgMatches = [];
    for (let s = 1; s <= 17; s++) {
      // Look for "SDG 1" or "SDG-1" or "SDG1" or "SDG: 1"
      const regex = new RegExp(`SDG\\s*[-:]*\\s*${s}\\b`, 'i');
      if (regex.test(text)) {
        sdgMatches.push(s);
      }
    }
    
    console.log(`Page ${i + 1}: SDGs found = ${sdgMatches.join(', ') || 'none'}`);
  }
}

main().catch(console.error);
