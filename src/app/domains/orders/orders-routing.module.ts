import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { OrderListComponent } from './components/order-list/order-list.component'
import { OrderDetailComponent } from './components/order-detail/order-detail.component'
import { OrdersLayoutComponent } from './components/orders-layout/orders-layout.component'
import { ToolbarGuard } from '../../shared/guards/toolbar.guard'

const routes: Routes = [
  {
    path: '',
    component: OrdersLayoutComponent,
    children: [
      {
        path: '',
        component: OrderListComponent,
        data: { title: 'ORDERS.TOOLBAR.LIST' },
        canActivate: [ToolbarGuard],
      },
      {
        path: ':id',
        component: OrderDetailComponent,
        data: { title: 'ORDERS.TOOLBAR.DETAIL' },
        canActivate: [ToolbarGuard],
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class OrdersRoutingModule { }
