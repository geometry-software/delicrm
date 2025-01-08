import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from './admin.state'
import { AdminConstants } from '../models/admin.constants'

const storeFeatureKey: string = AdminConstants.storeFeatureKey

export const getState = createFeatureSelector<State>(storeFeatureKey)
export const printMenu = createSelector(getState, (state) => state.print)
export const loadingStatus = createSelector(getState, (state) => state.loadingStatus)
export const getRestaurantInfo = createSelector(getState, (state) => state.restaurant)