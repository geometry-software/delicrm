import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { AuthRoutingModule } from './users-routing.module'
import { UsersComponent } from './components/users/users.component'
import { SharedModule } from '../../shared/shared.module'
import { TranslateModule } from '@ngx-translate/core'
import { StoreModule } from '@ngrx/store'
import { reducer } from './store/user.reducer'
import { EffectsModule } from '@ngrx/effects'
import { UserEffects } from './store/user.effects'
import { UserConstants } from './utils/user.constants'
import { UsersLayoutComponent } from './components/users-layout/users-layout.component'
import { AppInfoComponent } from '../../shared/components/app-info/app-info.component'
import { UserDetailComponent } from './components/user-detail/user-detail.component'

@NgModule({
  declarations: [
    UsersLayoutComponent,
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
    EffectsModule.forFeature([UserEffects]),
  ]
})
export class UserModule { }