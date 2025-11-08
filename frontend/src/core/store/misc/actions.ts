import store from '@core/store'
import {MiscState, MISC_ACTIONS} from './reducer'

export const setMiscState = (payload: Partial<MiscState>) => {
  return store.dispatch({type: MISC_ACTIONS.SET_MISC_STATE, payload})
}
