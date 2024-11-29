import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { concatMap, defaultIfEmpty, filter, map, switchMap, tap } from 'rxjs/operators'
import { ActivatedRoute } from '@angular/router'
import { Store } from '@ngrx/store'
import { AuthService } from '../../services/auth.service'
import { BehaviorSubject, of } from 'rxjs'
import { FormGroup } from '@angular/forms'
import { AdminUserLoadingStatus } from '../../models/auth-user-loading-status'
import { adminFormGroup, AdminFormProps } from '../../models/admin.form'
import { showFieldErrors } from '../../../shared/utils/form-error-handling'

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLoginComponent {

  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) { }

  adminForm = adminFormGroup
  adminFormProps = AdminFormProps
  isAdminUser = this.authService.isAdminUser

  showFieldErrors = showFieldErrors

  userDisplayName
  hasFirebasAuth


  loginUser() {
    this.authService.loginGoogle()
  }

  loginAdmin() {

  }

}