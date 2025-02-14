import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, ViewChild } from '@angular/core'
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

  @ViewChild('password') password: ElementRef;
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
      const email = this.form.value[AdminFormProps.email]
      const password = this.form.value[AdminFormProps.password]
      this.authService.signUpAdmin(email, password).pipe(
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
      this.form.markAsDirty()
      highlightInvalidFields(this.form)
    }
  }

  showPassword() {
    const el = this.password.nativeElement
    if (el.type === "password") {
      el.type = "text"
    } else {
      el.type = "password"
    }
  }

}