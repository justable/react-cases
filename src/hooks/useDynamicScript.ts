import { useState, useEffect } from 'react';
import { isBrowser } from 'umi';

export default function useDynamicScript(url: string, globalName: string) {
  const [source, setSource] = useState(() =>
    //@ts-ignore
    isBrowser() ? window[globalName] : '',
  );
  useEffect(() => {
    if (source) return;
    const script = document.createElement('script');
    script.src = url;
    script.onload = function () {
      //@ts-ignore
      setSource(() => window[globalName] || 'anonymous');
    };
    document.head.appendChild(script);
  }, []);
  return [source];
}
