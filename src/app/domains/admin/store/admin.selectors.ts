import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from './admin.reducer'
import { AdminConstants } from '../utils/admin.constants'

const storeFeatureKey: string = AdminConstants.storeFeatureKey

export const getState = createFeatureSelector<State>(storeFeatureKey)
export const printMenu = createSelector(getState, (state) => state.print)
