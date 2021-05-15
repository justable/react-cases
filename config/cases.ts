export interface ReactCases {
  [key: string]: ReactCase;
}

const reactCases: ReactCases = {
  '6gde76': {
    path: '/6gde76',
    title: '背景视差',
    description: '',
    component: '@/pages/parallax/background/index.tsx',
    theme: 'dark',
  },
  wv4twy: {
    path: '/wv4twy',
    title: '滚动视差',
    description: '',
    component: '@/pages/parallax/scroll/index.tsx',
    theme: 'light',
  },
  fz0eov: {
    path: '/fz0eov',
    title: '水纹特效',
    description: '',
    component: '@/pages/interaction/wave/index.tsx',
    theme: 'light',
  },
  fwefwf: {
    path: '/fwefwf',
    title: 'lottie动画',
    description: '',
    component: '@/pages/animation/lottie/index.tsx',
    theme: 'dark',
  },
};

export default reactCases;
