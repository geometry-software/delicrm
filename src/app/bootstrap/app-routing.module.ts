import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { NavbarComponent } from './components/navbar/navbar.component'
import { IndexComponent } from './components/index/index.component'
import { UserGuard } from '../domains/users/services/user.guard'
import { AppNotFoundComponent } from '../shared/components/app-not-found/app-not-found.component'

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
        path: 'client-orders',
        loadChildren: () => import('../domains/client-orders/client-orders.module').then((m) => m.ClientOrdersModule),
      },
      {
        path: 'users',
        loadChildren: () => import('../domains/users/users.module').then((m) => m.UsersModule),
        canActivate: [],
      },
      {
        path: 'clients',
        loadChildren: () => import('../domains/clients/clients.module').then((m) => m.ClientsModule),
        canActivate: [],
      },
      {
        path: 'board',
        loadChildren: () => import('../domains/admin/admin.module').then((m) => m.AdminModule),
        canActivate: [],
      },
      {
        path: 'shifts',
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
      },
      { path: '**', component: AppNotFoundComponent },
    ]
  },

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
