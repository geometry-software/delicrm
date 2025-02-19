import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import {
  catchError,
  combineLatest,
  EMPTY,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs'
import { ShiftActions as ItemActions } from './shift.actions'
import { Store } from '@ngrx/store'
import { getCurrent, getSize, getTotal } from './shift.selectors'
import { compareItemsRequestStateSize, formatRequest } from '../../../../shared/utils/format-request'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { SignalService } from '../../../../shared/services/signal.service'
import { formatResponseList } from '../../../../shared/repository/repository.utils'
import { NotificationService } from '../../../../shared/services/notification.service'
import { ShiftService } from '../../services/shift.service'

@Injectable()
export class ShiftEffects {

  constructor(
    private actions: Actions,
    private store: Store,
    private shiftService: ShiftService,
    private signalService: SignalService,
    private notificationService: NotificationService
  ) { }

  getItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItem),
      tap(() => this.handleLoadingRequest()),
      switchMap(({ id }) =>
        this.shiftService.getById(id).pipe(
          map(item => {
            this.handleLoadedRequest()
            return ItemActions.getItemSuccess({ item })
          }),
          catchError(error => of(ItemActions.notifyError({ error })))
        )))
  )

  getItems = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItems),
      tap(() => this.handleLoadingRequest()),
      withLatestFrom(
        this.store.select(getCurrent),
        this.store.select(getTotal),
        this.store.select(getSize)
      ),
      switchMap(([{ request }, current, total, stateSize]) => {
        const { query, size, item, sort, status } = formatRequest(request, stateSize)
        switch (query) {
          case 'first':
            return combineLatest([
              this.shiftService.getFirstPage(sort, size, status),
              this.shiftService.getTotalByStatus(status),
            ]).pipe(
              tap(() => this.handleLoadedRequest()),
              map(([items, total]) => ItemActions.getItemsSuccess({
                items: formatResponseList(query, items, total, current),
                size
              })
              ),
              catchError(error => of(ItemActions.notifyError({ error })))
            )
          case 'next':
            return this.shiftService
              .getNextPage(sort, size, status, item[sort.active])
              .pipe(
                tap(() => this.handleLoadedRequest()),
                map(items => ItemActions.getItemsSuccess({ items: formatResponseList(query, items, total, current) })),
                catchError(error => of(ItemActions.notifyError({ error })))
              )
          case 'previous':
            return this.shiftService
              .getPreviousPage(sort, size, status, item[sort.active])
              .pipe(
                tap(() => this.handleLoadedRequest()),
                map(items => ItemActions.getItemsSuccess({ items: formatResponseList(query, items, total, current) })),
                catchError(error => of(ItemActions.notifyError({ error })))
              )
          default: return EMPTY
        }
      }))
  )

  notifyError = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.notifyError),
      tap(({ error }) => this.notificationService.error(error))),
    { dispatch: false }
  )

  private handleLoadingRequest() {
    this.signalService.setLoadingStatus(LoadingStatus.Loading)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loading }))
  }

  private handleLoadedRequest() {
    this.signalService.setLoadingStatus(LoadingStatus.Loaded)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loaded }))
  }

}