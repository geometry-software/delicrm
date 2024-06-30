import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DeliveryListComponent } from './components/delivery-list/delivery-list.component'

const ROUTES: Routes = [
  {
    path: '',
    component: DeliveryListComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
})
export class DeliveryRoutingModule {}
