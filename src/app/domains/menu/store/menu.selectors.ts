import { createFeatureSelector, createSelector } from '@ngrx/store'
import { MenuConstants } from '../utils/menu.constants'
import { State } from './menu.state'

const storeFeatureKey = MenuConstants.storeFeatureKey

export const getState = createFeatureSelector<State>(storeFeatureKey)
export const loadingStatus = createSelector(getState, (state) => state.loadingStatus)
export const isRestaurantOpen = createSelector(getState, (state) => state.open)
export const getMenu = createSelector(getState, (state) => state.menu)
export const getExtras = createSelector(getState, (state) => state.extras)
export const getOrders = createSelector(getState, (state) => state.orders)
export const getOrder = createSelector(getState, (state) => state.order)
export const getClients = createSelector(getState, (state) => state.clients)
export const getRestaurantInfo = createSelector(getState, (state) => state.restaurant)
export const getCurrency = createSelector(getRestaurantInfo, (state) => state?.currency)