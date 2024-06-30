import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { OrderListComponent } from './components/order-list/order-list.component'
import { OrderDetailComponent } from './components/order-detail/order-detail.component'

const ROUTES: Routes = [
  {
    path: '',
    component: OrderListComponent,
  },
  {
    path: ':id',
    component: OrderDetailComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
})
export class WaiterRoutingModule {}
