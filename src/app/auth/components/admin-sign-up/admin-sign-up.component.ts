import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { AuthService } from '../../services/auth.service'
import { adminFormGroup, AdminFormProps } from '../../models/admin.form'
import { showFieldErrors } from '../../../shared/utils/form-error-handling'
import { catchError, EMPTY, filter, map, tap } from 'rxjs'
import { UserService } from '../../../domains/users/services/user.service'

@Component({
  selector: 'app-admin-sign-up',
  templateUrl: './admin-sign-up.component.html',
  styleUrls: ['./admin-sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSignUpComponent {

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private destroyRef: DestroyRef
  ) { }

  form = adminFormGroup
  formProps = AdminFormProps
  isLoading: boolean
  readonly showFieldErrors = showFieldErrors
  readonly hasUser = this.userService.getTotalByStatus('active').pipe(
    map(value => Boolean(value))
  )

  async submitForm() {
    this.isLoading = true
    if (this.form.valid) {
      this.authService.signUpAdmin(this.form.value).pipe(
        catchError(error => {
          console.error(error);
          this.isLoading = false
          return EMPTY
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        this.isLoading = false
        this.authService.checkAdminRegistration.next()
      })
    }
  }

}