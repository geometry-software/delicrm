import { NgModule } from '@angular/core'
import { OrdersRoutingModule } from './orders-routing.module'
import { OrderListComponent } from './components/order-list/order-list.component'
import { OrderDetailComponent } from './components/order-detail/order-detail.component'
import { SharedModule } from '../../shared/shared.module'
import { OrdersLayoutComponent } from './components/orders-layout/orders-layout.component'
import { StoreModule } from '@ngrx/store'
import { OrderEffects } from './store/order.effects'
import { OrderConstants } from './models/order.constants'
import { EffectsModule } from '@ngrx/effects'
import { reducer } from './store/order.reducer'

@NgModule({
  declarations: [
    OrdersLayoutComponent,
    OrderListComponent,
    OrderDetailComponent
  ],
  imports: [
    SharedModule,
    OrdersRoutingModule,
    StoreModule.forFeature(OrderConstants.storeFeatureKey, reducer),
    EffectsModule.forFeature([OrderEffects]),
  ],
})
export class WaiterModule { }