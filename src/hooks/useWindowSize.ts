import { useEffect } from 'react';
import { isBrowser } from 'umi';
import useRafState from './useRafState';

const useWindowSize = () => {
  const [state, setState] = useRafState<{ width: number; height: number }>({
    width: isBrowser() ? window.innerWidth : 0,
    height: isBrowser() ? window.innerHeight : 0,
  });

  useEffect((): (() => void) | void => {
    const handler = () => {
      setState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);

  return state;
};

export default useWindowSize;
