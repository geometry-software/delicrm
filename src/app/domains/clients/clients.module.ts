import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ClientsRoutingModule, } from './clients-routing.module'
import { ClientsComponent } from './components/clients/clients.component'
import { SharedModule } from '../../shared/shared.module'
import { TranslateModule } from '@ngx-translate/core'
import { StoreModule } from '@ngrx/store'
import { reducer } from './store/client.reducer'
import { EffectsModule } from '@ngrx/effects'
import { ClientEffects } from './store/client.effects'
import { ClientConstants } from './utils/client.constants'
import { ClientDetailComponent } from './components/client-detail/client-detail.component'
import { ClientStatusComponent } from './components/client-status/client-status.component'
import { ClientsLayoutComponent } from './components/clients-layout/clients-layout.component'

@NgModule({
  declarations: [
    ClientsLayoutComponent,
    ClientsComponent,
    ClientDetailComponent,
    ClientStatusComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ClientsRoutingModule,
    TranslateModule,
    StoreModule.forFeature(ClientConstants.storeFeatureKey, reducer),
    EffectsModule.forFeature([ClientEffects]),
  ]
})
export class ClientsModule { }