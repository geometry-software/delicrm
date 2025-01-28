import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DeliveryListComponent } from './components/delivery-list/delivery-list.component'
import { DeliveryLayoutComponent } from './components/delivery-layout/delivery-layout.component'
import { ClientOrderComponent } from './components/client-order/client-order.component'
import { ToolbarGuard } from '../../shared/guards/toolbar.guard'

const routes: Routes = [
  {
    path: '',
    component: DeliveryLayoutComponent,
    children: [
      {
        path: '',
        component: DeliveryListComponent,
        data: { title: 'DELIVERY.TOOLBAR.LIST' },
        canActivate: [ToolbarGuard],
      },
      {
        path: ':id',
        component: ClientOrderComponent,
        data: { title: 'DELIVERY.TOOLBAR.DETAIL' },
        canActivate: [ToolbarGuard],
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class DeliveryRoutingModule { }