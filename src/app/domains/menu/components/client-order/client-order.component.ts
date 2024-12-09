import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { pulseOnEnterAnimation } from 'angular-animations'

import { CheckoutService } from '../../services/checkout.service'
import { Order } from '../../utils/menu.model'
import { RecipeProtein } from '../../../recipe/models/recipe.model'
import { setProteinImage } from '../../../../shared/utils/protein-image'

@Component({
  selector: 'app-client-order',
  templateUrl: './client-order.component.html',
  styleUrls: ['./client-order.component.scss'],
  animations: [pulseOnEnterAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientOrderComponent implements OnInit {
  item: Order

  setProteinImage = setProteinImage

  constructor(private route: ActivatedRoute, private checkoutService: CheckoutService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id']
    this.checkoutService.getDeliveryById(id).subscribe(value => {
      this.item = value
      this.cdr.markForCheck()
    })
  }
}
