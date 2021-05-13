export const widthCss = (width: number | string) => {
  return {
    width,
    margin: '0 auto',
  };
};

export const changeTheme = (theme: ReactCase['theme']) => {
  if (theme === 'light') {
    document.documentElement.style.setProperty(`--bg`, '#fff');
    document.documentElement.style.setProperty(
      `--menuBG`,
      'rgba(1, 1, 1, 0.08)',
    );
    document.documentElement.style.setProperty(`--menuFontColor`, '#111');
    document.documentElement.style.setProperty(`--menuArrowBG`, '#111');
    document.documentElement.style.setProperty(`--menuArrowFontColor`, '#fff');
    document.documentElement.style.setProperty(`--cursorBorder`, '#111');
  } else {
    document.documentElement.style.setProperty(`--bg`, '#111');
    document.documentElement.style.setProperty(
      `--menuBG`,
      'rgba(255, 255, 255, 0.08)',
    );
    document.documentElement.style.setProperty(`--menuFontColor`, '#fff');
    document.documentElement.style.setProperty(`--menuArrowBG`, '#fff');
    document.documentElement.style.setProperty(`--menuArrowFontColor`, '#111');
    document.documentElement.style.setProperty(`--cursorBorder`, '#ccc');
  }
};
