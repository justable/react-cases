import { useState, useEffect, useRef } from 'react';
import { isBrowser, Link, useSelector } from 'umi';
import classNames from 'classnames';
import CustomCursor from '@/components/CustomCursor';
import { message, Spin } from 'antd';
import Icon, { CaretLeftOutlined, GithubOutlined } from '@ant-design/icons';
import Scrollbars, { renderLoading } from '@/components/CustomScrollbars';
import { isMobile, changeTheme } from '@/utils';
import reactCases from '../../config/reactcases.config';

const cases = Object.entries(reactCases);

if (isMobile()) {
  message.warn('为了更好的体验请在PC上访问');
}

const Menu: React.FC = () => {
  const [collapsed, setCollapsed] = useState(isMobile());
  const caseState = useSelector<RootState, ReactCase>((store) => {
    return store.case as ReactCase;
  });
  return (
    <div
      className={classNames('rcs-menu-container', {
        collapsed,
      })}
    >
      <div className="rcs-menu-wrapper">
        {isBrowser() ? (
          <Scrollbars autoHide>
            <ul className="rcs-menu">
              {cases.map(([k, c]) => {
                return (
                  <li
                    key={k}
                    className={classNames('rcs-menu-item', {
                      active: caseState.path === c.path,
                    })}
                    data-cursor="pointer"
                  >
                    <Link to={c.path} data-cursor="pointer">
                      {c.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Scrollbars>
        ) : (
          renderLoading()
        )}
      </div>
      <div
        className="rcs-menu-arrow"
        onClick={() => {
          setCollapsed((state) => !state);
        }}
        data-cursor="pointer"
      >
        <CaretLeftOutlined
          style={{
            transform: collapsed ? 'rotate(180deg)' : 'none',
            pointerEvents: 'none',
          }}
        />
      </div>
      <div className="rcs-menu-brand">
        <a
          href="https://github.com/justable/react-cases"
          target="_blank"
          data-cursor="pointer"
        >
          <GithubOutlined
            style={{
              pointerEvents: 'none',
            }}
          />
        </a>
      </div>
    </div>
  );
};

const CaseLayout: React.FC = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const caseState = useSelector<RootState, ReactCase>((store) => {
    return store.case as ReactCase;
  });
  useEffect(() => {
    changeTheme(caseState.theme);
  }, [caseState.theme]);
  return (
    <div
      ref={ref}
      style={{
        backgroundColor: 'var(--bg)',
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <Menu></Menu>
      {children}
      {/* {caseState.customCursor && <CustomCursor ground={ref}></CustomCursor>} */}
    </div>
  );
};

export default CaseLayout;
