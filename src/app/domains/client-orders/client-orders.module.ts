import { NgModule } from '@angular/core'
import { ClientOrdersRoutingModule } from './client-orders-routing.module'
// import { DeliveryListComponent } from './components/delivery-list/delivery-list.component'
import { SharedModule } from '../../shared/shared.module'
// import { DeliveryLayoutComponent } from './components/delivery-layout/delivery-layout.component'
// import { DeliveryStatusComponent } from './components/delivery-status/delivery-status.component'
import { ClientOrdersConstants } from './models/client-orders.constants'
import { DeliveryEffects } from './store/client-orders.effects'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { reducer } from './store/client-orders.reducer'
import { ClientOrderComponent } from './components/client-order/client-order.component'
import { ClientOrdersComponent } from './components/client-orders/client-orders.component'
import { ClientOrdersLayoutComponent } from './components/client-orders-layout/client-orders-layout.component'

@NgModule({
  declarations: [
    ClientOrdersLayoutComponent,
    ClientOrdersComponent
  ],
  imports: [
    SharedModule,
    ClientOrdersRoutingModule,
    StoreModule.forFeature(ClientOrdersConstants.storeFeatureKey, reducer),
    EffectsModule.forFeature([DeliveryEffects]),
  ],
})
export class ClientOrdersModule { }