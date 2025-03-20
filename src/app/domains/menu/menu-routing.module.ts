import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DailyMenuComponent } from './components/daily-menu/daily-menu.component'
import { OrderCheckoutComponent } from './components/order-checkout/order-checkout.component'
import { MenuLayoutComponent } from './components/menu-layout/menu-layout.component'
import { ToolbarGuard } from '../../shared/guards/toolbar.guard'
import { ClientOrderComponent } from '../client-orders/components/client-order/client-order.component'

const routes: Routes = [
  {
    path: '',
    component: MenuLayoutComponent,
    children: [
      {
        path: '',
        component: DailyMenuComponent,
        data: { title: 'MENU.TOOLBAR.MENU' },
        canActivate: [ToolbarGuard],
      },
      {
        path: 'checkout',
        component: OrderCheckoutComponent,
        data: { title: 'MENU.TOOLBAR.CHECKOUT' },
        canActivate: [ToolbarGuard],
      },
      {
        path: 'order/:id',
        component: ClientOrderComponent,
        data: { title: 'MENU.TOOLBAR.ORDER' },
        canActivate: [ToolbarGuard],
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class WaiterRoutingModule { }
