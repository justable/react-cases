declare module 'slash2';
declare module '*.json';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'mockjs';
declare module 'react-fittext';
declare module 'bizcharts-plugin-slider';

interface ReactCase {
  path: string;
  title: string;
  description?: string;
  component: string;
  theme: 'dark' | 'light';
  customCursor: boolean;
}

declare let Parallax: any;
declare let ALIYUN_ID: string;
declare let ALIYUN_SECRET: string;

declare interface RootState {
  case: object;
}

declare interface ClassAndStyleProps {
  className?: string;
  style?: CSSProperties;
}
