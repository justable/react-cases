import { RefObject, useEffect } from 'react';
import useRafState from './useRafState';

export interface State {
  docX: number;
  docY: number;
  posX: number;
  posY: number;
  elX: number;
  elY: number;
  elH: number;
  elW: number;
  hit: boolean;
}

const useMouse = (
  ref: RefObject<Element>,
  hitTargetFn?: (elm: HTMLElement) => boolean,
): State => {
  if (process.env.NODE_ENV === 'development') {
    if (typeof ref !== 'object' || typeof ref.current === 'undefined') {
      console.error('useMouse expects a single ref argument.');
    }
  }

  const [state, setState] = useRafState<State>({
    docX: 0,
    docY: 0,
    posX: 0,
    posY: 0,
    elX: 0,
    elY: 0,
    elH: 0,
    elW: 0,
    hit: false,
  });

  useEffect(() => {
    const moveHandler = (event: MouseEvent) => {
      if (ref && ref.current) {
        const {
          left,
          top,
          width: elW,
          height: elH,
        } = ref.current.getBoundingClientRect();
        const posX = left + window.pageXOffset;
        const posY = top + window.pageYOffset;
        const elX = event.pageX - posX;
        const elY = event.pageY - posY;
        const hit = hitTargetFn
          ? hitTargetFn(event.target as HTMLElement)
          : false;

        setState({
          docX: event.pageX,
          docY: event.pageY,
          posX,
          posY,
          elX,
          elY,
          elH,
          elW,
          hit,
        });
      }
    };

    document.addEventListener('mousemove', moveHandler);

    return () => {
      document.removeEventListener('mousemove', moveHandler);
    };
  }, [ref]);

  return state;
};

export default useMouse;
