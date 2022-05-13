import classNames from 'classnames';
import styles from './index.less';

export interface IconProps extends ClassAndStyleProps {
  type: string;
  color?: string;
}

const script = document.createElement('script');
script.src = '//at.alicdn.com/t/font_2831666_syxyourwqup.js';
document.body.appendChild(script);

const Icon: React.FC<IconProps> = ({ className, style, type, color }) => {
  if (!type) {
    return null;
  }
  const finalType = type.startsWith('icon') ? `#${type}` : `#icon${type}`;
  return (
    <svg
      className={classNames(styles.rcsIcon, className, 'rcs-icon')}
      style={{ color, ...style }}
      aria-hidden="true"
    >
      <use xlinkHref={finalType} />
    </svg>
  );
};

export default Icon;
