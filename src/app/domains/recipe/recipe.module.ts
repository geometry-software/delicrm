import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { RecipeRoutingModule } from './recipe-routing.module'
import { RecipeListComponent } from './components/recipe-list/recipe-list.component'
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component'
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component'
import { TranslateModule } from '@ngx-translate/core'
import { SharedModule } from '../../shared/shared.module'
import { RecipeLayoutComponent } from './components/recipe-layout/recipe-layout.component'
import { StoreModule } from '@ngrx/store'
import { RecipeConstants } from './models/recipe.constants'
import { reducer } from './store/recipe.reducer'
import { RecipeEntityService } from './services/recipe.service'
import { EffectsModule } from '@ngrx/effects'
import { RecipeEffects } from './store/recipe.effects'

@NgModule({
  declarations: [RecipeFormComponent, RecipeListComponent, RecipeDetailComponent, RecipeLayoutComponent],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RecipeRoutingModule,
    TranslateModule,
    StoreModule.forFeature(RecipeConstants.storeFeatureKey, reducer),
    EffectsModule.forFeature([RecipeEffects]),
  ],
  providers: [RecipeEntityService],
})
export class RecipeModule { }
