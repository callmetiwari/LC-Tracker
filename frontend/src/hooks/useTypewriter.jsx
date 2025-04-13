import { useState, useEffect } from 'react';

export function useTypewriter(words, speed = 100, delay = 1000) {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (index >= words.length) {
      setIndex(0);
      return;
    }

    if (!isDeleting && subIndex === words[index].length) {
      setTimeout(() => setIsDeleting(true), delay);
      return;
    }

    if (isDeleting && subIndex === 0) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) =>
        isDeleting ? prev - 1 : prev + 1
      );
      setText(words[index].substring(0, subIndex));
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, words, speed, delay]);

  return text;
}
