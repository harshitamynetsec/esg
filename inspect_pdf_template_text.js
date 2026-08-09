import fs from 'fs';
import path from 'path';
import { PDFDocument, PDFName } from 'pdf-lib';

/* global process */

async function main() {
  const pdfPath = path.resolve('REPORT FORMAT April 2026 with SDGs.pdf');
  const bytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(bytes);
  const pageCount = pdfDoc.getPageCount();
  console.log('pageCount', pageCount);
  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.getPage(i);
    const contents = page.node.get(PDFName.of('Contents'));
    const resolve = (obj) => (obj?.constructor?.name === 'PDFRef' ? pdfDoc.context.lookup(obj) : obj);
    const c = resolve(contents);
    const streams = c?.array ? c.array : [c];
    let text = '';
    for (const stream of streams) {
      const obj = resolve(stream);
      if (obj?.getContentsString) {
        text += obj.getContentsString();
      }
    }
    const snippet = [...text].map((char) => (char.charCodeAt(0) > 127 ? ' ' : char)).join('').slice(0, 400);
    const sdgRegex = /SDG\s*[-:]*\s*(\d{1,2})/gi;
    const goalsRegex = /Goal\s*[-:]*\s*(\d{1,2})/gi;
    const sdgs = [];
    const goals = [];
    let match;
    while ((match = sdgRegex.exec(text))) sdgs.push(match[1]);
    while ((match = goalsRegex.exec(text))) goals.push(match[1]);
    const good = /SDG|Goal|sustainable development goal|Sustainable Development Goal/i.test(text);
    if (good || sdgs.length || goals.length) {
      console.log('page', i+1, 'sdgs', sdgs.length?sdgs.join(','):'none', 'goals', goals.length?goals.join(','):'none');
      console.log(' snippet', JSON.stringify(snippet));
    }
  }
}
main().catch((err)=>{ console.error(err); process.exit(1); });
