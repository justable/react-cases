import { message } from 'antd';
import { createLogger } from 'redux-logger';

export const dva = {
  config: {
    onAction: createLogger(),
    onError(e: Error) {
      message.error(e.message, 3);
    },
  },
};
