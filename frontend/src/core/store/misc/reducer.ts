import {User} from '@/core/models'
import {createReducer} from '@reduxjs/toolkit'
import {Nullable} from 'types-helpers'

export interface MiscState {
  isAuthorized: Boolean
  user: Nullable<User>
}

export const MISC_ACTIONS = {
  SET_MISC_STATE: 'misc/SET_MISC_STATE',
}

const initialState: MiscState = {
  isAuthorized: false,
  user: null,
}

export default createReducer<MiscState>(initialState, {
  [MISC_ACTIONS.SET_MISC_STATE]: (state, action) => ({
    ...state,
    ...action.payload,
  }),
})
