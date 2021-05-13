import { useState, useEffect, useRef, useCallback, RefCallback } from 'react';
import useDynamicScript from '@/hooks/useDynamicScript';
import { widthCss } from '@/utils';
import {
  container,
  section,
  text,
  sectionImg,
  img1,
  img2,
  img3,
} from './style.less';
import classNames from 'classnames';

const App: React.FC = () => {
  return (
    <div className={container}>
      <div className={classNames(section, sectionImg, img1)}></div>
      <div className={classNames(section, sectionImg, img2)}>
        <div
          className={text}
          style={{
            transform: 'translate3d(-40%, 300%, -2px)',
          }}
        >
          01
        </div>
        <div
          className={text}
          style={{
            transform: 'translate3d(0, 60%, 0px)',
          }}
        >
          02
        </div>
        <div
          className={text}
          style={{
            transform: 'translate3d(40%, 40%, -1px)',
          }}
        >
          03
        </div>
      </div>
      <div className={classNames(section, sectionImg, img3)}></div>
    </div>
  );
};

export default App;
