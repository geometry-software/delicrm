import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DeliveryListComponent } from './components/delivery-list/delivery-list.component'
import { DeliveryLayoutComponent } from './components/delivery-layout/delivery-layout.component'
import { DeliveryDetailComponent } from './components/delivery-detail/delivery-detail.component'

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
        component: DeliveryDetailComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class DeliveryRoutingModule { }