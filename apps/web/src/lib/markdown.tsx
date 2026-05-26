import React from 'react';

export function renderMarkdown(md: string): React.ReactNode[] {
  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let inList = false;

  const parseInlineStyles = (text: string): React.ReactNode => {
    const parts = text.split('**');
    if (parts.length === 1) return text;
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="text-white font-bold">{part}</strong>;
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('* ')) {
      inList = true;
      const text = parseInlineStyles(line.slice(2));
      currentList.push(
        <li key={`li-${i}`} className="mb-2 pl-4 relative before:content-['//'] before:text-secondary before:absolute before:left-0 before:font-bold">
          {text}
        </li>
      );
      continue;
    } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
      if (inList) {
        elements.push(
          <ul key={`ul-${i}`} className="list-none pl-4 mb-6 text-text-accent/80 font-mono text-sm leading-relaxed">
            {currentList}
          </ul>
        );
        currentList = [];
        inList = false;
      }
      const text = parseInlineStyles(line);
      elements.push(
        <p key={`p-${i}`} className="mb-4 text-text-accent/90 font-mono text-sm leading-relaxed">
          {text}
        </p>
      );
      continue;
    } else {
      if (inList) {
        elements.push(
          <ul key={`ul-${i}`} className="list-none pl-4 mb-6 text-text-accent/80 font-mono text-sm leading-relaxed">
            {currentList}
          </ul>
        );
        currentList = [];
        inList = false;
      }
    }

    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-3xl md:text-5xl font-bold tracking-wider mb-8 pb-4 border-b border-secondary/20 text-white uppercase font-sans">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-lg md:text-xl font-bold tracking-wide mt-8 mb-4 text-secondary uppercase border-l-2 border-secondary pl-3">
          {line.slice(4)}
        </h3>
      );
    } else if (line === '---') {
      elements.push(<hr key={`hr-${i}`} className="my-8 border-secondary/10" />);
    } else if (line.length > 0) {
      elements.push(
        <p key={`p-${i}`} className="mb-4 text-text-accent/80 font-mono text-sm leading-relaxed">
          {parseInlineStyles(line)}
        </p>
      );
    }
  }

  if (inList) {
    elements.push(
      <ul key="ul-final" className="list-none pl-4 mb-6 text-text-accent/80 font-mono text-sm leading-relaxed">
        {currentList}
      </ul>
    );
  }

  return elements;
}
