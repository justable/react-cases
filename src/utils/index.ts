import { isBrowser } from 'umi';
import { dark, light } from './theme';

export const horizontalCenter = (width: number | string) => {
  return {
    width,
    margin: '0 auto',
  };
};

export const changeTheme = (theme: ReactCase['theme']) => {
  const themeObj = theme === 'light' ? light : dark;
  Object.entries(themeObj).forEach((t) => {
    document.documentElement.style.setProperty(t[0], t[1]);
  });
};

export const isMobile = () => {
  if (!isBrowser()) {
    return false;
  }
  const userAgentInfo = navigator.userAgent;
  const mobileAgents = [
    'Android',
    'iPhone',
    'SymbianOS',
    'Windows Phone',
    'iPad',
    'iPod',
  ];
  return mobileAgents.reduce((_, word) => {
    return _ || userAgentInfo.indexOf(word) > -1;
  }, false);
};
