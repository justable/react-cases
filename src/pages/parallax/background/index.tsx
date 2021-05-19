import { useState, useEffect, useRef, useCallback, RefCallback } from 'react';
import useDynamicScript from '@/hooks/useDynamicScript';
import useMeasure from '@/hooks/useMeasure';
import { horizontalCenter } from '@/utils';
import { container, layer1, layer2, layer3 } from './style.less';
import Amiya from '@/assets/images/amiya.png';

const App: React.FC = () => {
  const [sceneNode, sceneRef] = useMeasure();
  const [canvasNode, canvasRef] = useMeasure<HTMLCanvasElement>();

  const [Parallax] = useDynamicScript(
    'https://cdn.bootcdn.net/ajax/libs/parallax/3.1.0/parallax.min.js',
    'Parallax',
  );

  useEffect(() => {
    if (canvasNode) {
      const ctx = canvasNode.getContext('2d') || new CanvasRenderingContext2D();
      ctx.font = '20px serif';
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 1500; i++) {
        ctx.fillText('.', (i % 50) * 15 + 5, Math.floor(i / 50) * 15 + 5);
      }
    }
    if (Parallax && sceneNode && canvasNode) {
      // 更多配置参数参考https://github.com/wagerfield/parallax/blob/master/README.md
      new Parallax(sceneNode, {
        onReady: () => console.log('Parallax is ready to go now!'),
        hoverOnly: false,
        relativeInput: false,
        clipRelativeInput: true,
        originX: 0.2,
        originY: 0.2,
        scalarX: 10,
        // frictionX: 0.75, 摩擦系数
      });
    }
  }, [Parallax, sceneNode, canvasNode]);

  return (
    <div
      className={container}
      style={{
        ...horizontalCenter(1200),
        paddingTop: 100,
      }}
    >
      <div ref={sceneRef}>
        <canvas
          className={layer1}
          data-depth="1.00"
          ref={canvasRef}
          width="1000"
          height="600"
          style={{ marginLeft: 130 }}
        ></canvas>
        <img
          className={layer2}
          data-depth="-1.00"
          src={Amiya}
          alt="Amiya"
          style={{ ...horizontalCenter(750), marginLeft: 100 }}
        />
        <div
          className={layer3}
          data-depth="-1.20"
          style={{
            fontSize: '3.13rem',
            color: '#e3e3e3',
            padding: '0.94rem',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            marginTop: 300,
          }}
        >
          启航
        </div>
      </div>
    </div>
  );
};

export default App;
