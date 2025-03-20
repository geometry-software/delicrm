import { NgModule } from '@angular/core'
import { WaiterRoutingModule } from './menu-routing.module'
import { PlateDetailComponent } from './components/plate-detail/plate-detail.component'
import { DailyMenuComponent } from './components/daily-menu/daily-menu.component'
import { SharedModule } from '../../shared/shared.module'
import { OrderCheckoutComponent } from './components/order-checkout/order-checkout.component'
import { MenuLayoutComponent } from './components/menu-layout/menu-layout.component'
import { MenuConstants } from './utils/menu.constants'
import { MenuEffects } from './store/menu.effects'
import { reducer } from './store/menu.reducer'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { ClientService } from '../clients/services/client.service'

@NgModule({
  declarations: [
    MenuLayoutComponent,
    PlateDetailComponent,
    DailyMenuComponent,
    OrderCheckoutComponent
  ],
  imports: [
    SharedModule,
    WaiterRoutingModule,
    StoreModule.forFeature(MenuConstants.storeFeatureKey, reducer),
    EffectsModule.forFeature([MenuEffects]),
  ],
  providers: [ClientService]
})
export class WaiterModule { }