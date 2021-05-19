import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import Bowser from 'bowser';
import './index.less';

const App: React.FC = () => {
  const [valid, setValid] = useState(true);
  function onNoWarningClick() {
    if (typeof localStorage === 'object') {
      localStorage.setItem('browserwarning', 'disabled');
    }
    setValid(true);
  }
  const warning =
    '检测到您的浏览器版本过旧，为了更好的体验新版本，请下载最新的浏览器！';
  useEffect(() => {
    if (localStorage.getItem('browserwarning') !== 'disabled') {
      const browser = Bowser.getParser(window.navigator.userAgent);
      const isValidBrowser = browser.satisfies({
        ie: '~11',
        edge: '>=12',
        chrome: '>=29',
        firefox: '>=28',
        safari: '>=9',
        opera: '>=17',
      });
      setValid(!!isValidBrowser);
    }
  }, []);
  if (valid) return null;
  return (
    <div className="browser-warning">
      {warning}
      <Button className="nowarning-button" onClick={onNoWarningClick}>
        不再提醒
      </Button>
    </div>
  );
};

export default App;
