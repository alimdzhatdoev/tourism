import { AppState } from '@app/core/store';

export const userStateSelector = (state: AppState) => {
  return { ...state.user };
};
