import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component'
import { SharedModule } from '../shared/shared.module'
import { AdminSignUpComponent } from './components/admin-sign-up/admin-sign-up.component'
import { LoginComponent } from './components/login/login.component'
import { AuthRoutingModule } from './auth-routing.module'
import { ProfileComponent } from './components/profile/profile.component'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [AuthLayoutComponent, AdminSignUpComponent, LoginComponent, ProfileComponent],
  imports: [AuthRoutingModule, CommonModule, ReactiveFormsModule, SharedModule, RouterModule],
})
export class AuthModule { }