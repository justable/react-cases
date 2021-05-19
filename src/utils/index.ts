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
