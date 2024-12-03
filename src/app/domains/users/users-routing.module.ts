import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { UsersComponent } from './components/users/users.component'
import { UsersLayoutComponent } from './components/users-layout/users-layout.component'
import { AppInfoComponent } from '../../shared/components/app-info/app-info.component'

const routes: Routes = [
  {
    path: '',
    component: UsersLayoutComponent,
    children: [
      // {
      //   path: 'profile',
      //   component: ProfileComponent,
      //   data: { title: 'Login', type: 'empty' },
      // },
      {
        path: '',
        component: UsersComponent,
        // data: { title: 'Login', type: 'empty' },
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
