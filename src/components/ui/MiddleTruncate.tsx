import React, { useState, useEffect, useRef } from 'react';

interface MiddleTruncateProps {
  text: string;
  maxLength: number;
  truncatePosition?: 'middle' | 'end';
}

export function TruncateText({ text, maxLength, truncatePosition = 'end' }: MiddleTruncateProps) {
  const [truncatedText, setTruncatedText] = useState(text);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const truncateText = () => {
      if (containerRef.current && text.length > maxLength) {
        if (truncatePosition === 'middle') {
          const halfLength = Math.floor(maxLength / 2);
          const truncated = `${text.slice(0, halfLength)}...${text.slice(-halfLength)}`;
          setTruncatedText(truncated);
        } else {
          const truncated = `${text.slice(0, maxLength - 3)}...`;
          setTruncatedText(truncated);
        }
      } else {
        setTruncatedText(text);
      }
    };

    truncateText();
    window.addEventListener('resize', truncateText);
    return () => window.removeEventListener('resize', truncateText);
  }, [text, maxLength, truncatePosition]);

  return <div ref={containerRef} className="truncate">{truncatedText}</div>;
}