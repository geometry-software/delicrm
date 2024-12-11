import { NgModule } from '@angular/core'
import { AdminRoutingModule } from './admin-routing.module'
import { MenuFormComponent } from './components/menu-form/menu-form.component'
import { MenuDetailComponent } from './components/menu-detail/menu-detail.component'
import { CashDeskComponent } from './components/cash-desk/cash-desk.component'
import { SharedModule } from '../../shared/shared.module'
import { BoardLayoutComponent } from './components/board-layout/board-layout.component'
import { AdminService } from './services/admin.service'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { AdminConstants } from './models/admin.constants'
import { AdminEffects } from './store/admin.effects'
import { reducer } from './store/admin.reducer'
import { ImageMenuComponent } from './components/image-menu/image-menu.component'
import { RecipeEntityService } from '../recipe/services/recipe.service'

@NgModule({
  declarations: [
    BoardLayoutComponent,
    MenuFormComponent,
    ImageMenuComponent,
    MenuDetailComponent,
    CashDeskComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    StoreModule.forFeature(AdminConstants.storeFeatureKey, reducer),
    EffectsModule.forFeature([AdminEffects]),
  ],
  providers: [AdminService, RecipeEntityService],
})
export class AdminModule { }