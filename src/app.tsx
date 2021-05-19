import { message, Spin } from 'antd';
import { createLogger } from 'redux-logger';

export const initialStateConfig = {
  loading: <Spin />,
};

export const dva = {
  config: {
    onAction: createLogger(),
    onError(e: Error) {
      message.error(e.message, 3);
    },
  },
};
