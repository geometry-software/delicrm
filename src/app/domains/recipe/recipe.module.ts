import { NgModule } from '@angular/core'
import { RecipeRoutingModule } from './recipe-routing.module'
import { RecipeListComponent } from './components/recipe-list/recipe-list.component'
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component'
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component'
import { SharedModule } from '../../shared/shared.module'
import { RecipeLayoutComponent } from './components/recipe-layout/recipe-layout.component'
import { StoreModule } from '@ngrx/store'
import { RecipeConstants } from './models/recipe.constants'
import { reducer } from './store/recipe.reducer'
import { EffectsModule } from '@ngrx/effects'
import { RecipeEffects } from './store/recipe.effects'

@NgModule({
  declarations: [
    RecipeFormComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeLayoutComponent
  ],
  imports: [
    SharedModule,
    RecipeRoutingModule,
    StoreModule.forFeature(RecipeConstants.storeFeatureKey, reducer),
    EffectsModule.forFeature([RecipeEffects]),
  ]
})
export class RecipeModule { }
