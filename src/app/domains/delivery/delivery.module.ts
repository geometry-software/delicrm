import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { DeliveryRoutingModule } from './delivery-routing.module'
import { DeliveryListComponent } from './components/delivery-list/delivery-list.component'
import { TranslateModule } from '@ngx-translate/core'
import { SharedModule } from '../../shared/shared.module'
import { AdminService } from '../admin/services/admin.service'
import { DeliveryDetailComponent } from './components/delivery-detail/delivery-detail.component'
import { DeliveryService } from './services/delivery.service'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { DeliveryConstants } from './utils/delivery.constants'
import { reducer } from './store/delivery.reducer'
import { DeliveryEffects } from './store/delivery.effects'
import { DeliveryEntityService } from './services/recipe.service'

@NgModule({
  declarations: [DeliveryDetailComponent, DeliveryListComponent],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    DeliveryRoutingModule,
    TranslateModule,
    StoreModule.forFeature(DeliveryConstants.storeFeatureKey, reducer),
    EffectsModule.forFeature([DeliveryEffects]),
  ],
  providers: [DeliveryService, DeliveryEntityService],
})
export class DeliveryModule {}
