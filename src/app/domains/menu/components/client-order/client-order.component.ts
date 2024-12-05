import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { pulseOnEnterAnimation } from 'angular-animations'

import { CheckoutService } from '../../services/checkout.service'
import { Order } from '../../utils/waiter.model'
import { RecipeProtein } from '../../../recipe/utils/recipe.model'

@Component({
  selector: 'app-client-order',
  templateUrl: './client-order.component.html',
  styleUrls: ['./client-order.component.scss'],
  animations: [pulseOnEnterAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientOrderComponent implements OnInit {
  item: Order

  setProteinImage = (protein: RecipeProtein) => '/assets/images/' + protein + '.png'

  constructor(private route: ActivatedRoute, private checkoutService: CheckoutService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id']
    this.checkoutService.getDeliveryById(id).subscribe(value => {
      this.item = value
      this.cdr.markForCheck()
    })
  }
}
