import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';
import reactCases from '../../config/reactcases.config';

export interface CaseModelType {
  namespace: string;
  state: ReactCase;
  reducers: {
    changeCase: ImmerReducer<ReactCase>;
  };
  subscriptions: { setup: Subscription };
}
const LayoutModel: CaseModelType = {
  namespace: 'case',
  state: {
    path: '',
    title: '',
    description: '',
    component: '',
    theme: 'dark',
    customCursor: false,
  },
  reducers: {
    changeCase(state, action) {
      Object.assign(state, action.payload);
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        let reactCase = reactCases[pathname.slice(1)];
        if (reactCase) {
          dispatch({
            type: 'changeCase',
            payload: reactCase,
          });
        }
      });
    },
  },
};
export default LayoutModel;
