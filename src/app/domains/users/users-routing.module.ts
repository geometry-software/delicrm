import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { UsersComponent } from './components/users/users.component'
import { UsersLayoutComponent } from './components/users-layout/users-layout.component'
import { AppInfoComponent } from '../../shared/components/app-info/app-info.component'
import { UserDetailComponent } from './components/user-detail/user-detail.component'

const routes: Routes = [
  {
    path: '',
    component: UsersLayoutComponent,
    children: [
      {
        path: '',
        component: UsersComponent
      },
      {
        path: ':id',
        component: UserDetailComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class UsersRoutingModule { }
