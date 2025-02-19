import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import {
  catchError,
  combineLatest,
  EMPTY,
  first,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs'
import { ClientActions as ItemActions } from './client.actions'
import { Store } from '@ngrx/store'
import { getCurrent, getSize, getTotal } from './client.selectors'
import { compareItemsRequestStateSize, formatRequest } from '../../../shared/utils/format-request'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { ClientConstants } from '../models/client.constants'
import { SignalService } from '../../../shared/services/signal.service'
import { formatResponseList } from '../../../shared/repository/repository.utils'
import { ClientService } from '../services/client.service'
import { TranslateService } from '@ngx-translate/core'
import { NotificationService } from '../../../shared/services/notification.service'
import { DeliveryService } from '../../delivery/services/delivery.service'

@Injectable()
export class ClientEffects {

  constructor(
    private actions: Actions,
    private store: Store,
    private clientService: ClientService,
    private deliveryService: DeliveryService,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private signalService: SignalService
  ) { }

  readonly moduleUrl = ClientConstants.moduleUrl
  readonly defaultFirstPageRequest = ClientConstants.defaultPageRequest

  updateClientStatus = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateClientStatus),
      tap(() => this.handleLoadingRequest()),
      switchMap(({ id, status }) =>
        this.clientService.updateStatus(id, status).pipe(
          map(() => {
            this.handleLoadedRequest()
            return ItemActions.updateClientStatusSuccess()
          }),
          catchError(error => of(
            ItemActions.notifyError({ error, query: 'edit' }),
            ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Failed })
          )))))
  )

  updateClientStatusSuccess = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateClientStatusSuccess),
      switchMap(() => of(ItemActions.getItems({ request: this.defaultFirstPageRequest }))))
  )

  updateClient = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateClient),
      tap(() => this.signalService.setClientLoadingStatus(LoadingStatus.Loading)),
      switchMap(({ id, name, address, phone }) =>
        this.clientService.update(id, name, address, phone).pipe(
          map(() => ItemActions.updateClientSuccess()),
          catchError(error => {
            this.notificationService.error(error)
            this.signalService.setClientLoadingStatus(LoadingStatus.Failed)
            return EMPTY
          }))))
  )

  updateClientSuccess = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateClientSuccess),
      tap(() => this.signalService.setClientLoadingStatus(LoadingStatus.Loaded)),
      map(() => {
        this.notificationService.success('CLIENTS.FORM.UPDATE_CLIENT_SUCCESS')
        return ItemActions.getItems({
          request: {
            pagination: ClientConstants.defaultPageRequest.pagination,
            size: ClientConstants.defaultPageRequest.size,
            status: ClientConstants.statusList[0],
            sort: ClientConstants.defaultPageRequest.sort
          }
        })
      }))
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
              this.clientService.getTotalLabels(),
              this.clientService.getFirstPage(sort, size, status),
              this.clientService.getTotalByStatus(status),
            ]).pipe(
              tap(() => this.handleLoadedRequest()),
              switchMap(([amount, items, total]) =>
                [
                  ItemActions.getItemsSuccess({
                    items: formatResponseList(query, items, total, current),
                    size
                  }),
                  ItemActions.setItemsAmountByStatus({ status, amount })
                ]
              ),
              catchError(error => of(ItemActions.notifyError({ error, query })))
            )
          case 'next':
            return this.clientService
              .getNextPage(sort, size, status, item[sort.active])
              .pipe(
                tap(() => this.handleLoadedRequest()),
                map(items => ItemActions.getItemsSuccess({ items: formatResponseList(query, items, total, current) })),
                catchError(error => of(ItemActions.notifyError({ error, query })))
              )
          case 'previous':
            return this.clientService
              .getPreviousPage(sort, size, status, item[sort.active])
              .pipe(
                tap(() => this.handleLoadedRequest()),
                map(items => ItemActions.getItemsSuccess({ items: formatResponseList(query, items, total, current) })),
                catchError(error => of(ItemActions.notifyError({ error, query })))
              )
          default: return EMPTY
        }
      }))
  )

  getDeliveries = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getDeliveries),
      tap(() => this.signalService.setLoadingStatus(LoadingStatus.Loading)),
      switchMap(({ id }) =>
        this.deliveryService.getDeliveriesByClient(id).pipe(
          map(deliveries => {
            this.signalService.setLoadingStatus(LoadingStatus.Loaded)
            return ItemActions.getDeliveriesSuccess({ deliveries })
          }),
          catchError(error => {
            this.notificationService.error(error)
            this.signalService.setLoadingStatus(LoadingStatus.Failed)
            return EMPTY
          }))))
  )

  resetClientForm = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.resetClientForm),
      tap(() => this.signalService.setClientLoadingStatus(LoadingStatus.NotLoaded)))
    , { dispatch: false }
  )

  notifyError = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.notifyError),
      tap(({ error }) => console.error(error))),
    // TODO
    // switchMap(() => of(this.notificationService.notifyError()))
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