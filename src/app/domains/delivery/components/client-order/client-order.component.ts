import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { fadeInOnEnterAnimation, pulseOnEnterAnimation } from 'angular-animations'
import { setProteinImage } from '../../../../shared/utils/protein-image'
import { DeliveryService } from '../../services/delivery.service'
import { SharedModule } from '../../../../shared/shared.module'
import { UserService } from '../../../users/services/user.service'
import { filter, map, switchMap } from 'rxjs'
import { Order } from '../../../orders/models/order.model'
import { MatDialog } from '@angular/material/dialog'
import { DeliveryStatusComponent } from '../delivery-status/delivery-status.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Store } from '@ngrx/store'
import { DeliveryActions as ItemActions } from '../../store/delivery.actions'
import { getLoadingStatus } from '../../store/delivery.selectors'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { Delivery } from '../../models/delivery.model'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-client-order',
  templateUrl: './client-order.component.html',
  styleUrls: ['./client-order.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
    pulseOnEnterAnimation()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SharedModule]
})
export class ClientOrderComponent {

  constructor(
    private route: ActivatedRoute,
    private deliveryService: DeliveryService,
    private userService: UserService,
    private dialog: MatDialog,
    private destroyRef: DestroyRef,
    private snackBar: MatSnackBar,
    private store: Store
  ) { }

  readonly auth = this.userService.appAuth
  readonly user = this.userService.appUser
  readonly delivery = this.route.params.pipe(
    map(value => value['id']),
    // TODO
    // how to fetch restricted collection record if only auth exists
    switchMap(id => this.deliveryService.getById(id))
  )

  readonly setProteinImage = setProteinImage
  readonly loadingStatus = this.store.select(getLoadingStatus)
  readonly LoadingStatus = LoadingStatus

  getDeliveryTime(delivery: Delivery) {
    return delivery.deliveryInfo.time !== 'now' ? delivery.deliveryInfo.delayedTime : '30 min'
  }

  getTotal(order: Order) {
    return order.price.total + ' ' + order.price.currency
  }

  copyAddress(delivery: Delivery) {
    navigator.clipboard.writeText(delivery.deliveryInfo.address)
      .then(() => this.openSnackBar('Dirección fue copiado'))
  }

  copyPhone(delivery: Delivery) {
    navigator.clipboard.writeText(delivery.deliveryInfo.phone)
      .then(() => this.openSnackBar('Teléfono fue copiado'))
  }


  private openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
    })
  }

  update() {
    this.dialog.open(DeliveryStatusComponent, {
      width: '300px',
      // TODO
      // maxWidth: '300px',
      height: 'auto',
      autoFocus: false
    }).afterClosed().pipe(
      filter(Boolean),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(status => this.store.dispatch(ItemActions.updateDeliveryStatus({ id: this.route.snapshot.params['id'], status })))
  }

}