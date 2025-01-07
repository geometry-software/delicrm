import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { pulseOnEnterAnimation } from 'angular-animations'
import { setProteinImage } from '../../../../shared/utils/protein-image'
import { Delivery } from '../../models/delivery.model'
import { DeliveryService } from '../../services/delivery.service'
import { SharedModule } from '../../../../shared/shared.module'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-client-order',
  templateUrl: './client-order.component.html',
  styleUrls: ['./client-order.component.scss'],
  animations: [pulseOnEnterAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SharedModule]
})
export class ClientOrderComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private deliveryService: DeliveryService,
    private destroyRef: DestroyRef
  ) { }

  delivery: Delivery
  readonly setProteinImage = setProteinImage

  get deliveryTime() {
    return this.delivery?.order.category.delivery?.time !== 'now' ? this.delivery?.order.category.delivery?.time : '30 min'
  }

  get total() {
    return this.delivery.order.price.total + ' ' + this.delivery.order.price.currency
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id']
    // TODO
    // how to fetch restricted collection record if only auth exists
    this.deliveryService.getById(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(delivery => {
      this.delivery = delivery
      this.cdr.markForCheck()
    })
  }

}