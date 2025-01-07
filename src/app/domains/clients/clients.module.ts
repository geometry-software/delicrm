import { NgModule } from '@angular/core'
import { ClientsRoutingModule, } from './clients-routing.module'
import { ClientsComponent } from './components/clients/clients.component'
import { SharedModule } from '../../shared/shared.module'
import { StoreModule } from '@ngrx/store'
import { reducer } from './store/client.reducer'
import { EffectsModule } from '@ngrx/effects'
import { ClientEffects } from './store/client.effects'
import { ClientConstants } from './models/client.constants'
import { ClientDetailComponent } from './components/client-detail/client-detail.component'
import { ClientStatusComponent } from './components/client-status/client-status.component'
import { ClientsLayoutComponent } from './components/clients-layout/clients-layout.component'
import { ClientService } from './services/client.service'

@NgModule({
  declarations: [
    ClientsLayoutComponent,
    ClientsComponent,
    ClientDetailComponent,
    ClientStatusComponent
  ],
  imports: [
    SharedModule,
    ClientsRoutingModule,
    StoreModule.forFeature(ClientConstants.storeFeatureKey, reducer),
    EffectsModule.forFeature([ClientEffects]),
  ],
  providers: [ClientService]
})
export class ClientsModule { }