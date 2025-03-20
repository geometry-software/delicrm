import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ToolbarGuard } from '../../shared/guards/toolbar.guard'
import { ClientOrderComponent } from './components/client-order/client-order.component'
import { ClientOrdersComponent } from './components/client-orders/client-orders.component'
import { ClientOrdersLayoutComponent } from './components/client-orders-layout/client-orders-layout.component'

const routes: Routes = [
  {
    path: '',
    component: ClientOrdersLayoutComponent,
    children: [
      {
        path: '',
        component: ClientOrdersComponent,
        data: { title: 'CLIENT_ORDERS.TOOLBAR.LIST' },
        canActivate: [ToolbarGuard],
      },
      {
        path: ':id',
        component: ClientOrderComponent,
        data: { title: 'CLIENT_ORDERS.TOOLBAR.DETAIL' },
        canActivate: [ToolbarGuard],
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ClientOrdersRoutingModule { }