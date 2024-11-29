import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { NavbarComponent } from './components/navbar/navbar.component'
import { IndexComponent } from './components/index/index.component'
import { UserGuard } from '../domains/users/services/user.guard'

export const routes: Routes = [
  {
    path: '',
    component: NavbarComponent,
    children: [
      { path: '', component: IndexComponent },
      {
        path: 'auth',
        loadChildren: () => import('../auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'users',
        loadChildren: () => import('../domains/users/users.module').then((m) => m.UserModule),
      },
      {
        path: 'admin',
        loadChildren: () => import('../domains/admin/admin.module').then((m) => m.AdminModule),
        canActivate: [],
      },
      {
        path: 'menu',
        loadChildren: () => import('../domains/menu/menu.module').then((m) => m.WaiterModule),
        canActivate: [],
      },
      {
        path: 'orders',
        loadChildren: () => import('../domains/orders/orders.module').then((m) => m.WaiterModule),
        canActivate: [],
      },
      {
        path: 'delivery',
        loadChildren: () => import('../domains/delivery/delivery.module').then((m) => m.DeliveryModule),
        canActivate: [],
      },
      {
        path: 'recipes',
        loadChildren: () => import('../domains/recipe/recipe.module').then((m) => m.RecipeModule),
        canActivate: [],
      },
      {
        path: 'expenses',
        loadChildren: () => import('../domains/expenses/expenses.module').then((m) => m.ExpensesModule),
        canActivate: [],
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
