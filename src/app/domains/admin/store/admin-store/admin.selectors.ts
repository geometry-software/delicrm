import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from './admin.state'
import { AdminConstants } from '../../models/admin.constants'

const storeFeatureKey: string = AdminConstants.storeFeatureKey

export const getState = createFeatureSelector<State>(storeFeatureKey)
export const printMenu = createSelector(getState, (state) => state.print)
export const loadingStatus = createSelector(getState, (state) => state.loadingStatus)
export const getRestaurantInfo = createSelector(getState, (state) => state.restaurant)
export const getRecipes = createSelector(getState, (state) => state.recipes)
export const getMenu = createSelector(getState, (state) => state.menu)
export const isRestaurantOpen = createSelector(getMenu, (state) => state?.open)
export const getCurrency = createSelector(getRestaurantInfo, (state) => state?.currency)
export const getRestaurantLocale = createSelector(getRestaurantInfo, (state) => state?.locale)
export const rebuildMenu = createSelector(getState, (state) => state.rebuildMenu)