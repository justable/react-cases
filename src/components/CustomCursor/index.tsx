import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  RefCallback,
  MouseEvent,
} from 'react';
import { cursorContainer, cursorOuter } from './style.less';

interface CustomCursorProps {
  x: number;
  y: number;
  shrink?: boolean;
}
function getStyle(x: number, y: number, shrink: boolean) {
  const style = {
    transform: 'translate3d(-50%,-50%,0)',
    left: x,
    top: y,
  };
  const shrinkStyle = {
    width: 20,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
  };
  if (shrink) {
    Object.assign(style, shrinkStyle);
  }
  return style;
}
const App: React.FC<CustomCursorProps> = ({ x, y, shrink = false }) => {
  return (
    <div className={cursorContainer}>
      <div className={cursorOuter} style={{ ...getStyle(x, y, shrink) }}></div>
    </div>
  );
};

export default App;
