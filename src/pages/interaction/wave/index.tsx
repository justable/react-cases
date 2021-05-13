import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  RefCallback,
  MouseEvent,
} from 'react';
import useWindowSize from '@/hooks/useWindowSize';
import {
  container,
  waveBlock,
  wave,
  wave0,
  wave1,
  wave2,
  wave3,
  wave4,
  wave5,
} from './style.less';
import classNames from 'classnames';

interface WaveBlockProps {
  x: number;
  y: number;
  z: number;
  halfvmin: number;
}
const WaveBlock: React.FC<WaveBlockProps> = ({ x, y, z, halfvmin }) => {
  return (
    <div
      className={classNames(waveBlock)}
      style={{ top: `${y - 150}px`, left: `${x - 150}px`, zIndex: z }}
    >
      <div className={classNames(wave, wave5)}></div>
      <div className={classNames(wave, wave4)}></div>
      <div className={classNames(wave, wave3)}></div>
      <div className={classNames(wave, wave2)}></div>
      <div className={classNames(wave, wave1)}></div>
      <div className={classNames(wave, wave0)}></div>
    </div>
  );
};
const App: React.FC = () => {
  const { width, height } = useWindowSize();
  const [waves, setWaves] = useState<Omit<WaveBlockProps, 'halfvmin'>[]>([]);
  const halfvmin = useMemo(() => {
    return width > height ? height / 5 : (width / 5) * 0.8;
  }, [width, height]);

  function handleClick(e: MouseEvent<HTMLDivElement>) {
    setWaves((state) => {
      return [
        ...state,
        {
          x: e.clientX,
          y: e.clientY,
          z: state[state.length - 1] ? state[state.length - 1].z + 1 : 1,
        },
      ];
    });
    setTimeout(() => {
      setWaves((state) => {
        return state.slice(1);
      });
    }, 3000);
  }
  return (
    <div className={container} onClick={handleClick}>
      {waves.map((w) => {
        return (
          <WaveBlock
            key={`wave${w.z}`}
            x={w.x}
            y={w.y}
            z={w.z}
            halfvmin={halfvmin}
          ></WaveBlock>
        );
      })}
    </div>
  );
};

export default App;
