import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { pulseOnEnterAnimation } from 'angular-animations'
import { Order } from '../../../orders/models/order.model'
import { setProteinImage } from '../../../../shared/utils/protein-image'

@Component({
  selector: 'app-client-order',
  templateUrl: './client-order.component.html',
  styleUrls: ['./client-order.component.scss'],
  animations: [pulseOnEnterAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientOrderComponent implements OnInit {

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  item: Order

  readonly setProteinImage = setProteinImage

  ngOnInit() {
    const id = this.route.snapshot.params['id']
    // this.checkoutService.getDeliveryById(id).subscribe(value => {
    //   this.item = value
    //   this.cdr.markForCheck()
    // })
  }

}