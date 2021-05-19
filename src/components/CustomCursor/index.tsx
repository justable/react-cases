import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  RefCallback,
  MouseEvent,
  RefObject,
} from 'react';
import useMouse from '@/hooks/useMouse';
import { cursorContainer, cursorOuter } from './style.less';

interface CustomCursorProps {
  ground: RefObject<HTMLDivElement>;
}
function getStyle(x: number, y: number, hit: boolean) {
  const style = {
    transform: 'translate3d(-50%,-50%,0)',
    left: x || -40,
    top: y || -40,
  };
  const hitStyle = {
    width: 20,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
  };
  if (hit) {
    Object.assign(style, hitStyle);
  }
  return style;
}
const App: React.FC<CustomCursorProps> = ({ ground }) => {
  const { docX, docY, hit } = useMouse(
    ground,
    (target) => target.dataset.cursor === 'pointer',
  );

  return (
    <div className={cursorContainer}>
      <div
        className={cursorOuter}
        style={{ ...getStyle(docX, docY, hit) }}
      ></div>
    </div>
  );
};

export default App;
