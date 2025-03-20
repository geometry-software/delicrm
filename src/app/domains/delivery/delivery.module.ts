import { NgModule } from '@angular/core'
import { DeliveryRoutingModule } from './client-orders-routing.module'
import { DeliveryListComponent } from './components/delivery-list/delivery-list.component'
import { SharedModule } from '../../shared/shared.module'
import { DeliveryLayoutComponent } from './components/delivery-layout/delivery-layout.component'
import { DeliveryConstants } from './models/delivery.constants'
import { DeliveryEffects } from './store/delivery.effects'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { reducer } from './store/delivery.reducer'

@NgModule({
  declarations: [
    DeliveryLayoutComponent,
    DeliveryListComponent
  ],
  imports: [
    SharedModule,
    DeliveryRoutingModule,
    StoreModule.forFeature(DeliveryConstants.storeFeatureKey, reducer),
    EffectsModule.forFeature([DeliveryEffects]),
  ],
})
export class DeliveryModule { }