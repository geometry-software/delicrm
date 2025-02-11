import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, combineLatest, EMPTY, map, of, switchMap, tap, withLatestFrom } from 'rxjs'
import { DeliveryActions as ItemActions } from './delivery.actions'
import { Store } from '@ngrx/store'
import { getCurrent, getSize, getTotal } from './delivery.selectors'
import { compareItemsRequestStateSize, formatRequest } from '../../../shared/utils/format-request'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { DeliveryConstants } from '../models/delivery.constants'
import { SignalService } from '../../../shared/services/signal.service'
import { formatResponseList } from '../../../shared/repository/repository.utils'
import { DeliveryService } from '../services/delivery.service'
import { NotificationService } from '../../../shared/services/notification.service'

@Injectable()
export class DeliveryEffects {

  constructor(
    private actions: Actions,
    private store: Store,
    private deliveryService: DeliveryService,
    private signalService: SignalService,
    private notificationService: NotificationService
  ) { }

  readonly moduleUrl = DeliveryConstants.moduleUrl

  updateDeliveryStatus = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateDeliveryStatus),
      tap(() => this.handleLoadingRequest()),
      switchMap(({ id, status }) =>
        this.deliveryService.updateStatus(id, status).pipe(
          map(() => {
            this.handleLoadedRequest()
            return ItemActions.updateDeliveryStatusSuccess({ status })
          }),
          catchError(error => of(
            ItemActions.notifyError({ error }),
            ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Failed })
          ))))),
    { dispatch: false }
  )

  getItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItem),
      tap(() => this.handleLoadingRequest()),
      switchMap(({ id }) =>
        this.deliveryService.getById(id).pipe(
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
              this.deliveryService.getTotalLabels(),
              this.deliveryService.getFirstPage(sort, size, status),
              this.deliveryService.getTotalByStatus(status),
            ]).pipe(
              tap(() => this.handleLoadedRequest()),
              switchMap(([amount, items, total]) =>
                [
                  ItemActions.getItemsSuccess({
                    items: formatResponseList(query, items, total, current, compareItemsRequestStateSize(size, stateSize)),
                    size
                  }),
                  ItemActions.setItemsAmountByStatus({ status, amount })
                ]
              ),
              catchError(error => of(ItemActions.notifyError({ error })))
            )
          case 'next':
            return this.deliveryService
              .getNextPage(sort, size, status, item[sort.active])
              .pipe(
                tap(() => this.handleLoadedRequest()),
                map(items => ItemActions.getItemsSuccess({ items: formatResponseList(query, items, total, current) })),
                catchError(error => of(ItemActions.notifyError({ error })))
              )
          case 'previous':
            return this.deliveryService
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