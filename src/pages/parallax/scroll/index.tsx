import { useState, useEffect, useRef, useCallback, RefCallback } from 'react';
import useDynamicScript from '@/hooks/useDynamicScript';
import { horizontalCenter } from '@/utils';
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
          我很慢
        </div>
        <div
          style={{
            transform: 'translate3d(0, 60%, 0px)',
          }}
        >
          我很快
        </div>
        <div
          style={{
            transform: 'translate3d(40%, 40%, -1px)',
          }}
        >
          我很二
        </div>
      </div>
      <div className={classNames(section, sectionImg, img3)}></div>
    </div>
  );
};

export default App;
