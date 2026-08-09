import fs from 'fs/promises';
import { PDFDocument, PDFName } from 'pdf-lib';

async function main() {
  const bytes = await fs.readFile('./REPORT FORMAT April 2026 with SDGs.pdf');
  const pdfDoc = await PDFDocument.load(bytes);
  
  const catalog = pdfDoc.catalog;
  const outlinesRef = catalog.get(PDFName.of('Outlines'));
  if (!outlinesRef) {
    console.log('No outlines/bookmarks found in this PDF.');
    return;
  }
  
  const outlines = pdfDoc.context.lookup(outlinesRef);
  console.log('Outlines keys:', outlines.keys().map(k => k.toString()));
  
  const traverse = (nodeRef, depth = 0) => {
    if (!nodeRef) return;
    const node = pdfDoc.context.lookup(nodeRef);
    const title = node.get(PDFName.of('Title'));
    const first = node.get(PDFName.of('First'));
    const next = node.get(PDFName.of('Next'));
    
    if (title) {
      // Decode title string
      console.log('  '.repeat(depth) + `Title: ${title.toString()}`);
    }
    
    if (first) {
      traverse(first, depth + 1);
    }
    if (next) {
      traverse(next, depth);
    }
  };
  
  const first = outlines.get(PDFName.of('First'));
  traverse(first);
}

main().catch(console.error);
