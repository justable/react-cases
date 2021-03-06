import { useState, useEffect, useRef, useCallback, RefCallback } from 'react';
import useDynamicScript from '@/hooks/useDynamicScript';
import useMeasure from '@/hooks/useMeasure';
import { horizontalCenter } from '@/utils';

const App: React.FC = () => {
  const [sceneNode, sceneRef] = useMeasure();

  // const [_] = useDynamicScript(
  //   'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js',
  //   '_',
  // );

  const [bodymovin] = useDynamicScript(
    'https://cdn.bootcdn.net/ajax/libs/lottie-web/5.7.8/lottie.min.js',
    'bodymovin',
  );

  useEffect(() => {
    if (bodymovin && sceneNode) {
      const animation = bodymovin.loadAnimation({
        container: sceneNode,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'lottie-data.json',
      });
    }
  }, [bodymovin, sceneNode]);

  return (
    <div ref={sceneRef} style={{ height: '100%' }}>
      {/* <lottie-player src="/static/lottie/data.json" background="transparent" speed="1" style="width: 300px; height: 300px;"  loop autoplay >
  </lottie-player> */}
    </div>
  );
};

export default App;
