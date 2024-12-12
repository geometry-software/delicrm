import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { OrderListComponent } from './components/order-list/order-list.component'
import { OrderDetailComponent } from './components/order-detail/order-detail.component'
import { OrdersLayoutComponent } from './components/orders-layout/orders-layout.component'

const routes: Routes = [
  {
    path: '',
    component: OrdersLayoutComponent,
    children: [
      {
        path: '',
        component: OrderListComponent,
      },
      {
        path: ':id',
        component: OrderDetailComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class OrdersRoutingModule { }
