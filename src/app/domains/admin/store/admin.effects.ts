import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, delay, of, switchMap, tap } from 'rxjs'
import { AdminActions as ItemActions } from './admin.actions'
import { Router } from '@angular/router'
import { AdminConstants } from '../models/admin.constants'
import { Store } from '@ngrx/store'
import { RestaurantService } from '../services/restaurant.service'
import { SignalService } from '../../../shared/services/signal.service'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { RepositoryEntityAction } from '../../../shared/repository/repository.model'

@Injectable()
export class AdminEffects {
  constructor(
    private router: Router,
    private actions: Actions,
    private store: Store,
    private restaurantService: RestaurantService,
    private signalService: SignalService
  ) { }

  readonly moduleUrl = AdminConstants.moduleUrl
  readonly deleteTitle = AdminConstants.deleteTitle
  readonly defaultCreateStatus = AdminConstants.defaultCreateStatus

  createDailyMenu = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createDailyMenu),
      tap(() => {
        this.signalService.setLoadingStatus(LoadingStatus.Loading)
        this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loading }))
      }),
      switchMap(({ menu }) => this.restaurantService.updateDailyMenu(menu).pipe(
        tap(() => {
          this.signalService.setLoadingStatus(LoadingStatus.Loaded)
          this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loaded }))
          this.router.navigate(['admin/board'])
        }),
        catchError(error => this.handleError(error, 'create'))))),
    { dispatch: false }
  )

  printMenu = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.printMenu),
      tap(() => {
        this.signalService.setLoadingStatus(LoadingStatus.Loading)
        this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loading }))
      })),
    { dispatch: false }
  )

  printMenuSuccess = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.printMenuSuccess),
      delay(1000),
      tap(() => {
        this.signalService.setLoadingStatus(LoadingStatus.Loaded)
        this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loaded }))
      })),
    { dispatch: false }
  )

  private handleError(error, type: RepositoryEntityAction) {
    this.signalService.setLoadingStatus(LoadingStatus.LoadingFailed)
    return of(ItemActions.notifyError({ error, errorType: type }))
  }

}