import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { AuthRoutingModule } from './users-routing.module'
// import { ProfileComponent } from './components/profile/profile.component'
import { UsersComponent } from './components/users/users.component'
import { SharedModule } from '../../shared/shared.module'
import { TranslateModule } from '@ngx-translate/core'
import { StoreModule } from '@ngrx/store'
import { reducer } from './store/user.reducer'
import { EffectsModule } from '@ngrx/effects'
import { AuthEffects } from './store/user.effects'
import { UserConstants } from './utils/user.constants'
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component'
import { AppInfoComponent } from '../../shared/components/app-info/app-info.component'
import { UserDetailComponent } from './components/user-detail/user-detail.component'

@NgModule({
  declarations: [
    AuthLayoutComponent,
    // ProfileComponent,
    UsersComponent,
    UserDetailComponent,
    AppInfoComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    TranslateModule,
    StoreModule.forFeature(UserConstants.storeFeatureKey, reducer),
    EffectsModule.forFeature([AuthEffects]),
  ]
})
export class UserModule { }