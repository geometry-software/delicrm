import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DeliveryListComponent } from './components/delivery-list/delivery-list.component'
import { DeliveryLayoutComponent } from './components/delivery-layout/delivery-layout.component'
import { ClientOrderComponent } from './components/client-order/client-order.component'

const routes: Routes = [
  {
    path: '',
    component: DeliveryLayoutComponent,
    children: [
      {
        path: '',
        component: DeliveryListComponent,
      },
      {
        path: ':id',
        component: ClientOrderComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class DeliveryRoutingModule { }