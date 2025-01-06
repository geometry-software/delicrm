import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { pulseOnEnterAnimation } from 'angular-animations'
import { Order } from '../../../orders/models/order.model'
import { setProteinImage } from '../../../../shared/utils/protein-image'
import { OrderService } from '../../../orders/services/order.service'
import { RestaurantService } from '../../../admin/services/restaurant.service'
import { combineLatest } from 'rxjs'
import { Delivery } from '../../../delivery/models/delivery.model'
import { DeliveryService } from '../../../delivery/services/delivery.service'

@Component({
  selector: 'app-client-order',
  templateUrl: './client-order.component.html',
  styleUrls: ['./client-order.component.scss'],
  animations: [pulseOnEnterAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientOrderComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private deliveryService: DeliveryService,
    private restaurantService: RestaurantService,
  ) { }

  item: Delivery
  currency: string
  readonly setProteinImage = setProteinImage

  ngOnInit() {
    const id = this.route.snapshot.params['id']
    // TODO
    // how to fetch restricted collection record if only auth exists
    combineLatest([
      this.deliveryService.getById(id),
      this.restaurantService.getRestaurantInfo()
    ]).subscribe(([order, restaurant]) => {
      this.currency = restaurant.currency
      this.item = order
      this.cdr.markForCheck()
      console.log(order, restaurant);
    })
  }

  getDeliveryTime() {
    return this.item?.order.category.delivery?.time !== 'now' ? this.item?.order.category.delivery?.time : '30 min'
  }

}