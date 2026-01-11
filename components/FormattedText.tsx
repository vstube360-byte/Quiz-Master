import React from 'react';
import katex from 'katex';

interface FormattedTextProps {
  text: string;
  className?: string;
}

const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  // Regex to split text by LaTeX delimiters: $$...$$ for block, $...$ for inline
  // Using a capturing group (...) includes the delimiters in the result array so we can process them
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          // Block math
          const content = part.slice(2, -2);
          try {
            const html = katex.renderToString(content, { displayMode: true, throwOnError: false });
            return <span key={index} dangerouslySetInnerHTML={{ __html: html }} className="block my-2" />;
          } catch (e) {
            console.error("KaTeX error:", e);
            return <span key={index}>{part}</span>;
          }
        } else if (part.startsWith('$') && part.endsWith('$')) {
          // Inline math
          const content = part.slice(1, -1);
          try {
            const html = katex.renderToString(content, { displayMode: false, throwOnError: false });
            return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
          } catch (e) {
            console.error("KaTeX error:", e);
            return <span key={index}>{part}</span>;
          }
        } else {
          // Regular text
          return <span key={index}>{part}</span>;
        }
      })}
    </span>
  );
};

export default FormattedText;