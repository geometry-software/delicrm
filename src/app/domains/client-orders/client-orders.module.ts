import { NgModule } from '@angular/core'
import { ClientOrdersRoutingModule } from './client-orders-routing.module'
import { SharedModule } from '../../shared/shared.module'
import { ClientOrdersConstants } from './models/client-orders.constants'
import { ClientOrdersEffects } from './store/client-orders.effects'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { reducer } from './store/client-orders.reducer'
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
    EffectsModule.forFeature([ClientOrdersEffects]),
  ],
})
export class ClientOrdersModule { }