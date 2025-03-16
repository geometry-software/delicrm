import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from './board.state'
import { AdminConstants } from '../../models/admin.constants'

export const getState = createFeatureSelector<State>(AdminConstants.storeFeatureKey)
export const printMenu = createSelector(getState, (state) => state.print)
export const loadingStatus = createSelector(getState, (state) => state.loadingStatus)
export const getRestaurantInfo = createSelector(getState, (state) => state.restaurant)
export const getRecipes = createSelector(getState, (state) => state.recipes)
export const getAlacarteMenu = createSelector(getState, (state) => state.alacarte)
export const getMenu = createSelector(getState, (state) => state.menu)
export const isRestaurantOpen = createSelector(getState, (state) => state.open)
export const getCurrency = createSelector(getRestaurantInfo, (state) => state?.currency)
export const rebuildMenu = createSelector(getState, (state) => state.rebuildMenu)