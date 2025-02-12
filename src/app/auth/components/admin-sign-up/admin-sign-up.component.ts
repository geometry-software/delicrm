import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { AuthService } from '../../services/auth.service'
import { adminFormGroup, AdminFormProps } from '../../models/admin.form'
import { highlightInvalidFields, showFieldErrors } from '../../../shared/utils/form-error-handling'
import { catchError, combineLatest, EMPTY, filter, first, map, tap } from 'rxjs'
import { UserService } from '../../../domains/users/services/user.service'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { SignalService } from '../../../shared/services/signal.service'
// import { BootstarpConstants } from '../../../bootstrap/models/bootstrap.constants'

@Component({
  selector: 'app-admin-sign-up',
  templateUrl: './admin-sign-up.component.html',
  styleUrls: ['./admin-sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSignUpComponent {

  constructor(
    private authService: AuthService,
    private destroyRef: DestroyRef,
    private signalService: SignalService,
  ) { }

  readonly showFieldErrors = showFieldErrors
  readonly hasUser = this.authService.hasAdminUser().pipe(
    map(value => Boolean(value)))
  readonly form = adminFormGroup
  readonly formProps = AdminFormProps

  isLoading: boolean
  isNotMatchedPasswordErrorShown: boolean

  async submitForm() {
    this.isLoading = true
    this.isNotMatchedPasswordErrorShown = false
    this.signalService.setLoadingStatus(LoadingStatus.Loading)
    if (this.form.valid) {
      this.authService.signUpAdmin(this.form.value).pipe(
        catchError(error => {
          console.error(error);
          this.isLoading = false
          this.signalService.setLoadingStatus(LoadingStatus.Failed)
          return EMPTY
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        this.isLoading = false
        this.signalService.setLoadingStatus(LoadingStatus.Loaded)
        this.authService.checkAdminRegistration.next()
      })
    } else {
      this.isNotMatchedPasswordErrorShown = true
      this.isLoading = false
      this.signalService.setLoadingStatus(LoadingStatus.Failed)
      highlightInvalidFields(this.form)
    }
  }

}