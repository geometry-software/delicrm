import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { UsersComponent } from './components/users/users.component'
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component'
import { AppInfoComponent } from '../../shared/components/app-info/app-info.component'

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      // {
      //   path: 'profile',
      //   component: ProfileComponent,
      //   data: { title: 'Login', type: 'empty' },
      // },
      {
        path: 'users',
        component: UsersComponent,
        data: { title: 'Login', type: 'empty' },
      },
      {
        path: 'info',
        component: AppInfoComponent,
        data: { title: 'Login', type: 'empty' },
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AuthRoutingModule { }
