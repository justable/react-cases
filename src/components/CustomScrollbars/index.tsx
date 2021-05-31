import { dynamic } from 'umi';
import { Spin } from 'antd';

export const renderLoading = () => (
  <div style={{ width: '100%', textAlign: 'center', paddingTop: 30 }}>
    <Spin />
  </div>
);

export default dynamic({
  loader: async () => {
    // 这里的注释 webpackChunkName 可以指导 webpack 将 react-custom-scrollbars 组件以这个名字的chunk单独拆分出去
    const { Scrollbars } = await import(
      /* webpackChunkName: "react-custom-scrollbars" */ 'react-custom-scrollbars'
    );
    return Scrollbars;
  },
  loading: () => renderLoading(),
});
