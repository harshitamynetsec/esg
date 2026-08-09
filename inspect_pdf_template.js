import fs from 'fs';
import path from 'path';
import { PDFDocument, PDFName } from 'pdf-lib';

(async () => {
  const pdfPath = path.resolve('REPORT FORMAT April 2026 with SDGs.pdf');
  const bytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(bytes);
  console.log('pageCount', pdfDoc.getPageCount());
  const outlinesRef = pdfDoc.catalog.get(PDFName.of('Outlines'));
  console.log('outlinesRef', !!outlinesRef);
  if (outlinesRef) {
    const outlines = pdfDoc.context.lookup(outlinesRef);
    console.log('outline keys', outlines.keys().map((k) => k.toString()));
    const first = outlines.get(PDFName.of('First'));
    console.log('outline first', first?.toString());
  }
  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const page = pdfDoc.getPage(i);
    const contents = page.node.get(PDFName.of('Contents'));
    const resolve = (obj) => {
      if (!obj) return obj;
      if (obj.constructor && obj.constructor.name === 'PDFRef') return pdfDoc.context.lookup(obj);
      return obj;
    };
    const c = resolve(contents);
    const streams = c?.array ? c.array : [c];
    console.log('page', i + 1, 'streams', streams.length);
    for (const [j, stream] of streams.entries()) {
      const obj = resolve(stream);
      console.log(' page', i+1, 'stream', j, 'type', obj?.constructor?.name, 'getContentsString', typeof obj?.getContentsString);
      if (typeof obj?.getContentsString === 'function') {
        try {
          const s = obj.getContentsString();
          console.log('  len', s.length, 'preview', JSON.stringify(s.slice(0, 120)));
        } catch (err) {
          console.log('  getContentsString err', err.message);
        }
      }
    }
  }
})();
