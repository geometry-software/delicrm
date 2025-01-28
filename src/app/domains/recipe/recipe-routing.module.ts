import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { RecipeListComponent } from './components/recipe-list/recipe-list.component'
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component'
import { RecipeLayoutComponent } from './components/recipe-layout/recipe-layout.component'
import { ToolbarGuard } from '../../shared/guards/toolbar.guard'

const routes: Routes = [
  {
    path: '',
    component: RecipeLayoutComponent,
    children: [
      {
        path: '',
        component: RecipeListComponent,
        data: { title: 'RECIPES.TOOLBAR.LIST', type: 'list' },
        canActivate: [ToolbarGuard],
      },
      {
        path: 'create',
        component: RecipeFormComponent,
        data: { title: 'RECIPES.TOOLBAR.CREATE', type: 'form' },
        canActivate: [ToolbarGuard],
      },
      {
        path: ':id',
        component: RecipeFormComponent,
        data: { title: 'RECIPES.TOOLBAR.EDIT', type: 'form' },
        canActivate: [ToolbarGuard],
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class RecipeRoutingModule { }
