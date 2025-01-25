import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { UsersRoutingModule } from './users-routing.module'
import { UsersComponent } from './components/users/users.component'
import { SharedModule } from '../../shared/shared.module'
import { StoreModule } from '@ngrx/store'
import { reducer } from './store/user.reducer'
import { EffectsModule } from '@ngrx/effects'
import { UserEffects } from './store/user.effects'
import { UsersLayoutComponent } from './components/users-layout/users-layout.component'
import { UserDetailComponent } from './components/user-detail/user-detail.component'
import { UserStatusComponent } from './components/user-status/users-status.component'
import { UserConstants } from './models/user.constants'
import { UserFormComponent } from './components/user-form/user-form.component'

@NgModule({
  declarations: [
    UsersLayoutComponent,
    UsersComponent,
    UserFormComponent,
    UserStatusComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    StoreModule.forFeature(UserConstants.storeFeatureKey, reducer),
    EffectsModule.forFeature([UserEffects]),
  ]
})
export class UsersModule { }