const isSeparatorRow = (cells) => cells.every((cell) => /^:?-+:?$/.test(cell));

const parseBlocks = (content) => {
  const lines = content.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.startsWith('### ')) {
      blocks.push({ type: 'h4', text: line.slice(4) });
      i += 1;
      continue;
    }

    if (line.startsWith('## ')) {
      blocks.push({ type: 'h3', text: line.slice(3) });
      i += 1;
      continue;
    }

    if (line.startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i += 1;
      }
      const rows = tableLines
        .map((row) => row.split('|').slice(1, -1).map((cell) => cell.trim()))
        .filter((cells) => !isSeparatorRow(cells));
      blocks.push({ type: 'table', header: rows[0], rows: rows.slice(1) });
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i += 1;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    if (/^-\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^-\s/.test(lines[i])) {
        items.push(lines[i].slice(2));
        i += 1;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    const paragraphLines = [];
    while (
      i < lines.length
      && lines[i].trim()
      && !lines[i].startsWith('#')
      && !lines[i].startsWith('|')
      && !/^-\s/.test(lines[i])
      && !/^\d+\.\s/.test(lines[i])
    ) {
      paragraphLines.push(lines[i]);
      i += 1;
    }
    blocks.push({ type: 'p', text: paragraphLines.join(' ') });
  }

  return blocks;
};

const renderInline = (text, keyPrefix) => text
  .split(/(\*\*[^*]+\*\*)/g)
  .filter(Boolean)
  .map((part, index) => (part.startsWith('**') && part.endsWith('**')
    ? <strong key={`${keyPrefix}-${index}`}>{part.slice(2, -2)}</strong>
    : <span key={`${keyPrefix}-${index}`}>{part}</span>));

export default function LessonContent({ content }) {
  const blocks = parseBlocks(content || '');

  return (
    <div className="lesson-content">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        if (block.type === 'h3') return <h3 key={key} className="lesson-heading-1">{block.text}</h3>;
        if (block.type === 'h4') return <h4 key={key} className="lesson-heading-2">{block.text}</h4>;
        if (block.type === 'ul') {
          return (
            <ul key={key} className="lesson-list">
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === 'ol') {
          return (
            <ol key={key} className="lesson-list">
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
              ))}
            </ol>
          );
        }
        if (block.type === 'table') {
          return (
            <div key={key} className="lesson-table-wrap">
              <table className="lesson-table">
                <thead>
                  <tr>
                    {block.header.map((cell, cellIndex) => <th key={`${key}-h-${cellIndex}`}>{cell}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={`${key}-r-${rowIndex}`}>
                      {row.map((cell, cellIndex) => <td key={`${key}-r-${rowIndex}-${cellIndex}`}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return <p key={key} className="lesson-paragraph">{renderInline(block.text, key)}</p>;
      })}
    </div>
  );
}
