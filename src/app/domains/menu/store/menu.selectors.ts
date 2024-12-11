import { createFeatureSelector, createSelector } from '@ngrx/store'
import { MenuConstants } from '../utils/menu.constants'
import { State } from './menu.state'

const storeFeatureKey: string = MenuConstants.storeFeatureKey

export const getState = createFeatureSelector<State>(storeFeatureKey)
export const loadingStatus = createSelector(getState, (state) => state.loadingStatus)
export const isRestaurantOpen = createSelector(getState, (state) => state.open)
export const getMenu = createSelector(getState, (state) => state.menu)
export const getExtra = createSelector(getState, (state) => state.extra)
export const getOrder = createSelector(getState, (state) => state.order)