import { useState, useEffect, useRef } from 'react';
import { Link, useSelector } from 'umi';
import classNames from 'classnames';
import CustomCursor from '@/components/CustomCursor';
import useMouse from '@/hooks/useMouse';
import Icon, { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import reactCases from '../../config/cases';

const cases = Object.entries(reactCases);

const Menu: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const caseState = useSelector<RootState, ReactCase>((store) => {
    return store.case as ReactCase;
  });
  return (
    <div
      className={classNames('rcs-menu-container', {
        collapsed,
      })}
    >
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
      <div
        className="rcs-arrow"
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
    </div>
  );
};

const CaseLayout: React.FC = ({ children }) => {
  const ref = useRef(null);
  const { docX, docY, shouldShrink } = useMouse(ref);
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
      <CustomCursor x={docX} y={docY} shrink={shouldShrink}></CustomCursor>
    </div>
  );
};

export default CaseLayout;
