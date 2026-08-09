import fs from 'fs';
import path from 'path';
import { PDFDocument, PDFName } from 'pdf-lib';

/* global process */

function dumpRef(ref) {
  return ref?.toString?.() || String(ref);
}

function getTitle(node) {
  const title = node.get(PDFName.of('Title'));
  return title?.toString?.() || '<no title>';
}

async function main() {
  const bytes = fs.readFileSync(path.resolve('REPORT FORMAT April 2026 with SDGs.pdf'));
  const pdfDoc = await PDFDocument.load(bytes);
  const outlinesRef = pdfDoc.catalog.get(PDFName.of('Outlines'));
  console.log('pageCount', pdfDoc.getPageCount());
  if (!outlinesRef) {
    console.log('No outlines');
    return;
  }
  const outlines = pdfDoc.context.lookup(outlinesRef);
  console.log('outline root keys', outlines.keys().map((k)=>k.toString()));
  function traverse(nodeRef, depth=0) {
    if (!nodeRef) return;
    const node = pdfDoc.context.lookup(nodeRef);
    if (!node) return;
    const title = getTitle(node);
    const dest = node.get(PDFName.of('Dest'));
    const a = node.get(PDFName.of('A'));
    const first = node.get(PDFName.of('First'));
    const next = node.get(PDFName.of('Next'));
    console.log(' '.repeat(depth*2) + 'Title:', title);
    if (dest) {
      console.log(' '.repeat(depth*2) + ' Dest:', dumpRef(dest));
    }
    if (a) {
      const keys = a.keys().map(k=>k.toString());
      console.log(' '.repeat(depth*2) + ' Action keys:', keys);
      const s = a.get(PDFName.of('S'));
      const uri = a.get(PDFName.of('URI'));
      const d = a.get(PDFName.of('D'));
      if (s) console.log(' '.repeat(depth*2) + '  S:', s.toString());
      if (uri) console.log(' '.repeat(depth*2) + '  URI:', uri.toString());
      if (d) console.log(' '.repeat(depth*2) + '  D:', dumpRef(d));
    }
    if (first) traverse(first, depth+1);
    if (next) traverse(next, depth);
  }
  const first = outlines.get(PDFName.of('First'));
  traverse(first);
}

main().catch((err)=>{ console.error(err); process.exit(1); });
