import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects'
import { catchError, combineLatest, delay, map, of, switchMap, tap } from 'rxjs'
import { AdminActions as ItemActions } from './admin.actions'
import { Router } from '@angular/router'
import { Action, Store } from '@ngrx/store'
import { RestaurantService } from '../../services/restaurant.service'
import { SignalService } from '../../../../shared/services/signal.service'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { RepositoryRequestQuery } from '../../../../shared/repository/repository.models'
import { calculateShiftSummary } from '../../utils/calculate-shift-summary'
import { AdminConstants } from '../../models/admin.constants'
import { ShiftService } from '../../services/shift.service'
import { MenuFormService } from '../../services/menu-form.service'
import { RecipeService } from '../../../recipe/services/recipe.service'

@Injectable()
export class AdminEffects implements OnInitEffects {

  constructor(
    private router: Router,
    private actions: Actions,
    private store: Store,
    private restaurantService: RestaurantService,
    private recipeService: RecipeService,
    private menuFormService: MenuFormService,
    private shiftService: ShiftService,
    private signalService: SignalService
  ) { }

  readonly moduleUrl = AdminConstants.moduleUrl
  readonly deleteTitle = AdminConstants.deleteTitle
  readonly defaultCreateStatus = AdminConstants.defaultCreateStatus

  ngrxOnInitEffects(): Action {
    return ItemActions.getRestaurantInfo()
  }

  getRestaurantInfo = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getRestaurantInfo),
      tap(() => this.setLoading()),
      switchMap(() => combineLatest([
        this.restaurantService.getRestaurantInfo(),
        this.restaurantService.getDailyMenu(),
        this.recipeService.getAll(),
      ]).pipe(
        map(([restaurant, menu, recipes]) => {
          this.menuFormService.initForm(menu, recipes)
          return ItemActions.setRestaurantInfo({ restaurant, recipes })
        }),
        tap(() => this.setLoaded()),
        catchError(error => this.handleError(error, 'create'))))))

  setRestaurantInfo = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.setRestaurantInfo),
      tap(() => this.setLoading()),
      map(() => ItemActions.getDailyMenu()))
  )

  getDailyMenu = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getDailyMenu),
      tap(() => this.setLoading()),
      switchMap(() => this.restaurantService.getDailyMenu().pipe(
        map(menu => {
          this.setLoaded()
          return ItemActions.setDailyMenu({ menu })
        }),
        catchError(error => this.handleError(error, 'create')))))
  )

  createDailyMenu = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createDailyMenu),
      tap(() => this.setLoading()),
      switchMap(({ menu }) => this.restaurantService.updateDailyMenu(menu).pipe(
        map(() => {
          this.setLoaded()
          this.router.navigate(['admin'])
          return ItemActions.getDailyMenu()
        }),
        catchError(error => this.handleError(error, 'create')))))
  )

  rebuildDailyMenu = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.rebuildDailyMenu),
      map(() => {
        this.menuFormService.resetChosenPlates()
        this.router.navigate(['/admin/daily'])
        return ItemActions.rebuildDailyMenuSuccess()
      })
    )
  )

  copyDailyMenu = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.copyDailyMenu),
      tap(() => this.menuFormService.patchForms())
    ), { dispatch: false }
  )

  closeShift = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.closeShift),
      tap(() => this.setLoading()),
      switchMap(() => this.restaurantService.getDailyMenu().pipe(
        map(({ orders, createdAt }) => calculateShiftSummary(orders, createdAt)),
        switchMap(shift => this.restaurantService.cleanDailyMenu().pipe(
          switchMap(() => this.shiftService.create(shift).pipe(
            map(id => {
              this.setLoaded()
              this.router.navigate(['/shifts/report', id])
              return ItemActions.closeShiftSuccess()
            })
          ))
        )),
        catchError(error => this.handleError(error, 'create')))),
      catchError(error => this.handleError(error, 'create')))
  )

  updateRestaurant = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateRestaurant),
      tap(() => this.setLoading()),
      switchMap(({ restaurant }) => this.restaurantService.updateRestaurantInfo(restaurant).pipe(
        map(() => {
          this.setLoaded()
          return ItemActions.getRestaurantInfo()
        }),
        catchError(error => this.handleError(error, 'create')))))
  )

  printMenu = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.printMenu),
      tap(() => this.setLoading()))
    , { dispatch: false }
  )

  printMenuSuccess = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.printMenuSuccess),
      delay(1000),
      tap(() => this.setLoaded()))
    , { dispatch: false }
  )

  private handleError(error, type: RepositoryRequestQuery) {
    this.signalService.setLoadingStatus(LoadingStatus.Failed)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Failed }))
    return of(ItemActions.notifyError({ error, errorType: type }))
  }

  private setLoading() {
    this.signalService.setLoadingStatus(LoadingStatus.Loading)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loading }))
  }

  private setLoaded() {
    this.signalService.setLoadingStatus(LoadingStatus.Loaded)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loaded }))
  }

}