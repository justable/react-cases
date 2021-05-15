import { useState, useEffect, useRef, useCallback, RefCallback } from 'react';
import useDynamicScript from '@/hooks/useDynamicScript';
import { widthCss } from '@/utils';
import { container, section, sectionImg, img1, img2, img3 } from './style.less';
import classNames from 'classnames';
import cloud1 from '@/assets/images/board-cloud-1.png';
import cloud2 from '@/assets/images/board-cloud-2.png';
import cloud3 from '@/assets/images/board-cloud-3.png';
import cloud4 from '@/assets/images/board-cloud-4.png';

const App: React.FC = () => {
  return (
    <div className={container}>
      <div className={classNames(section, sectionImg, img1)}></div>
      <div className={classNames(section, sectionImg, img2)}>
        <div
          style={{
            transform: 'translate3d(-40%, 300%, -2px)',
          }}
        >
          <img src={cloud1} alt="cloud1" height="100" />
        </div>
        <div
          style={{
            transform: 'translate3d(0, 60%, 0px)',
          }}
        >
          <img src={cloud2} alt="cloud2" height="100" />
        </div>
        <div
          style={{
            transform: 'translate3d(40%, 40%, -1px)',
          }}
        >
          <img src={cloud4} alt="cloud4" height="100" />
        </div>
      </div>
      <div className={classNames(section, sectionImg, img3)}></div>
    </div>
  );
};

export default App;
