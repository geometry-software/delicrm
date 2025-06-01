import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { fadeInOnEnterAnimation, pulseOnEnterAnimation } from 'angular-animations'
import { setProteinImage } from '../../../../shared/utils/protein-image'
import { SharedModule } from '../../../../shared/shared.module'
import { catchError, EMPTY, filter, map, switchMap, tap } from 'rxjs'
import { MatDialog } from '@angular/material/dialog'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Store } from '@ngrx/store'
import { DeliveryActions } from '../../../delivery/store/delivery.actions'
import { getLoadingStatus } from '../../store/client-orders.selectors'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import {
  Delivery,
  DELIVERY_STATUS_COLOR,
  DELIVERY_STATUS_ICON,
  DELIVERY_STATUS_TRANSLATE,
  DeliveryStatusBar,
  deliveryStatusRecord
} from '../../../delivery/models/delivery.model'
import { MatSnackBar } from '@angular/material/snack-bar'
import { DeliveryService } from '../../../delivery/services/delivery.service'
import { SessionService } from '../../../../auth/services/session.service'
import { SignalService } from '../../../../shared/services/signal.service'
import { TranslateService } from '@ngx-translate/core'
import { AppOrderStatusComponent } from '../../../../shared/components/app-order-status/app-order-status.component'

@Component({
    selector: 'app-client-order',
    templateUrl: './client-order.component.html',
    styleUrls: ['./client-order.component.scss'],
    animations: [
        fadeInOnEnterAnimation(),
        pulseOnEnterAnimation()
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SharedModule]
})
export class ClientOrderComponent {

  constructor(
    private route: ActivatedRoute,
    private deliveryService: DeliveryService,
    private dialog: MatDialog,
    private destroyRef: DestroyRef,
    private snackBar: MatSnackBar,
    private store: Store,
    private translateService: TranslateService,
    private sessionService: SessionService,
    private signalService: SignalService,
  ) { }

  readonly auth = this.sessionService.getAuth()
  readonly user = this.sessionService.getUser()
  readonly delivery = this.route.params.pipe(
    map(value => value['id']),
    tap(() => this.signalService.setLoadingStatus(LoadingStatus.Loading)),
    // TODO
    // how to fetch restricted collection record if only auth exists
    switchMap(id => this.deliveryService.getById(id).pipe(
      tap(() => this.signalService.setLoadingStatus(LoadingStatus.Loaded)),
      tap(delivery => {
        this.deliveryStatusBar = {
          progress: delivery.progress,
          status: delivery.status
        }
      }),
      catchError(() => {
        this.signalService.setLoadingStatus(LoadingStatus.Failed)
        return EMPTY
      })
    ))
  )

  readonly statusColor = DELIVERY_STATUS_COLOR
  readonly statusIcon = DELIVERY_STATUS_ICON
  readonly deliveryTanslate = DELIVERY_STATUS_TRANSLATE
  deliveryStatusBar: DeliveryStatusBar

  readonly setProteinImage = setProteinImage
  readonly loadingStatus = this.store.select(getLoadingStatus)
  readonly LoadingStatus = LoadingStatus

  getDeliveryTime(delivery: Delivery) {
    return delivery.deliveryInfo.time !== 'now' ? delivery.deliveryInfo.delayedTime : '30 min'
  }

  getTotal(delivery: Delivery) {
    return delivery.order.price.total + ' ' + delivery.order.price.currency
  }

  getDeliveryPrice(delivery: Delivery) {
    return delivery.order.price.delivery + ' ' + delivery.order.price.currency
  }

  getOrderPrice(delivery: Delivery) {
    return delivery.order.price.order + ' ' + delivery.order.price.currency
  }

  getAlacartePrice(delivery: Delivery) {
    return delivery.order.price.alacarte + ' ' + delivery.order.price.currency
  }

  copyAddress(delivery: Delivery) {
    const message = this.translateService.instant('CLIENT_ORDERS.DETAIL.COPY_ADDRESS')
    navigator.clipboard.writeText(delivery.deliveryInfo.address)
      .then(() => this.openSnackBar(message))
  }

  copyPhone(delivery: Delivery) {
    const message = this.translateService.instant('CLIENT_ORDERS.DETAIL.COPY_PHONE')
    navigator.clipboard.writeText(delivery.deliveryInfo.phone)
      .then(() => this.openSnackBar(message))
  }


  private openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
    })
  }

  update() {
    this.dialog.open(AppOrderStatusComponent, {
      width: '300px',
      height: 'auto',
      autoFocus: false,
      data: {
        list: Object.entries(deliveryStatusRecord).map(([k]) => k)
      }
    }).afterClosed().pipe(
      filter(Boolean),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(status => this.store.dispatch(DeliveryActions.updateDeliveryStatus({ id: this.route.snapshot.params['id'], status })))
  }

}