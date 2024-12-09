import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DailyMenuComponent } from './components/daily-menu/daily-menu.component'
import { OrderCheckoutComponent } from './components/order-checkout/order-checkout.component'
import { MenuLayoutComponent } from './components/menu-layout/menu-layout.component'
import { ClientOrderComponent } from './components/client-order/client-order.component'

const routes: Routes = [
  {
    path: '',
    component: MenuLayoutComponent,
    children: [
      {
        path: '',
        component: DailyMenuComponent,
      },
      {
        path: 'checkout',
        component: OrderCheckoutComponent,
      },
      {
        path: 'client-order/:id',
        component: ClientOrderComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class WaiterRoutingModule { }
