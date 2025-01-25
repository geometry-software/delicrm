import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { UsersComponent } from './components/users/users.component'
import { UsersLayoutComponent } from './components/users-layout/users-layout.component'
import { UserFormComponent } from './components/user-form/user-form.component'

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
        component: UserFormComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class UsersRoutingModule { }
