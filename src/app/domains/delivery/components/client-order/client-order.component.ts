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

  getDeliveryTime(order: Order) {
    return order.category.delivery?.time !== 'now' ? order.category.delivery?.time : '30 min'
  }

  getTotal(order: Order) {
    return order.price.total + ' ' + order.price.currency
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