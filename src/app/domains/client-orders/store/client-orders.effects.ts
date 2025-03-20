import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { filter, map, switchMap, tap, } from 'rxjs'
import { ClientOrdersActions as ItemActions } from './client-orders.actions'
import { Store } from '@ngrx/store'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { SignalService } from '../../../shared/services/signal.service'
import { NotificationService } from '../../../shared/services/notification.service'
import { DeliveryService } from '../../delivery/services/delivery.service'
import { SessionService } from '../../../auth/services/session.service'

@Injectable()
export class ClientOrdersEffects {

  constructor(
    private actions: Actions,
    private store: Store,
    private deliveryService: DeliveryService,
    private signalService: SignalService,
    private notificationService: NotificationService,
    private sessionService: SessionService,
  ) { }

  getItems = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItems),
      tap(() => this.handleLoadingRequest()),
      switchMap(() => this.sessionService.getAuth().pipe(
        filter(Boolean),
        switchMap(auth => this.deliveryService.getDeliveriesById(auth.authId).pipe(
          tap(() => this.handleLoadedRequest()),
          map(deliveries => ItemActions.getItemsSuccess({ items: { data: deliveries, current: 0, total: deliveries.length } }))))))
    ))

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