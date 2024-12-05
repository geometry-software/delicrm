import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { WaiterRoutingModule } from './menu-routing.module'
import { PlateDetailComponent } from './components/plate-detail/plate-detail.component'
import { DailyMenuComponent } from './components/daily-menu/daily-menu.component'
import { TranslateModule } from '@ngx-translate/core'
import { SharedModule } from '../../shared/shared.module'
import { OrderCheckoutComponent } from './components/order-checkout/order-checkout.component'
import { MenuLayoutComponent } from './components/menu-layout/menu-layout.component'
import { ClientOrderComponent } from './components/client-order/client-order.component'
import { CheckoutService } from './services/checkout.service'
import { MenuService } from './services/menu.service'

@NgModule({
  declarations: [
    MenuLayoutComponent,
    PlateDetailComponent,
    DailyMenuComponent,
    OrderCheckoutComponent,
    ClientOrderComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    // ReactiveFormsModule, 
    // FormsModule, 
    WaiterRoutingModule,
    TranslateModule
  ],
  providers: [MenuService, CheckoutService],
})
export class WaiterModule { }
