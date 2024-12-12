import { NgModule } from '@angular/core'
import { DeliveryRoutingModule } from './delivery-routing.module'
import { DeliveryListComponent } from './components/delivery-list/delivery-list.component'
import { SharedModule } from '../../shared/shared.module'
import { DeliveryDetailComponent } from './components/delivery-detail/delivery-detail.component'
import { DeliveryService } from './services/delivery.service'
import { DeliveryLayoutComponent } from './components/delivery-layout/delivery-layout.component'

@NgModule({
  declarations: [
    DeliveryLayoutComponent,
    DeliveryDetailComponent,
    DeliveryListComponent
  ],
  imports: [
    SharedModule,
    DeliveryRoutingModule,
  ],
  providers: [DeliveryService],
})
export class DeliveryModule { }
