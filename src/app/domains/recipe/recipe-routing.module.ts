import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { RecipeListComponent } from './components/recipe-list/recipe-list.component'
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component'
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component'
import { RecipeLayoutComponent } from './components/recipe-layout/recipe-layout.component'

const routes: Routes = [
  {
    path: '',
    component: RecipeLayoutComponent,
    children: [
      {
        path: '',
        component: RecipeListComponent,
        data: { title: 'RECIPES.PAGE.LIST.TOOLBAR', type: 'list' },
      },
      {
        path: 'create',
        component: RecipeFormComponent,
        data: { title: 'RECIPES.PAGE.CREATE.TOOLBAR', type: 'form' },
      },
      {
        path: ':id/edit',
        component: RecipeFormComponent,
        data: { title: 'RECIPES.PAGE.EDIT.TOOLBAR', type: 'form' },
      },
      {
        path: ':id',
        component: RecipeDetailComponent,
        data: { title: 'RECIPES.PAGE.DETAIL.TOOLBAR', type: 'detail' },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class RecipeRoutingModule {}
