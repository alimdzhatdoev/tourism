import { store } from '@app/core/store';
import { UserState, USER_ACTIONS } from './reducer';

export const setUserState = (state: Partial<UserState>) => {
  return store.dispatch({
    type: USER_ACTIONS.SET_USER_STATE,
    payload: state,
  });
};
