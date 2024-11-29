import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component'
import { ProfileComponent } from './components/profile/profile.component'

const routes: Routes = [
  {
    path: 'login',
    component: AuthLayoutComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AuthRoutingModule { }
