import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ProfileComponent } from './components/profile/profile.component'
import { LoginComponent } from './components/login/login.component'
import { UsersComponent } from './components/users/users.component'
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component'
import { AppInfoComponent } from './components/app-info/app-info.component'

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Login', type: 'empty' },
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'Login', type: 'empty' },
      },
      {
        path: 'users',
        component: UsersComponent,
        data: { title: 'Login', type: 'empty' },
      },
      {
        path: 'info',
        component: AppInfoComponent,
        data: { title: 'Login', type: 'empty' },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AuthRoutingModule {}
