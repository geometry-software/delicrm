import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { AuthService } from '../../services/auth.service'
import { adminFormGroup, AdminFormProps } from '../../models/admin.form'
import { showFieldErrors } from '../../../shared/utils/form-error-handling'
import { catchError, firstValueFrom } from 'rxjs'

@Component({
  selector: 'app-admin-sign-up',
  templateUrl: './admin-sign-up.component.html',
  styleUrls: ['./admin-sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSignUpComponent {

  constructor(
    private authService: AuthService,
    private destroyRef: DestroyRef
  ) { }

  form = adminFormGroup
  formProps = AdminFormProps
  isLoading: boolean
  showFieldErrors = showFieldErrors

  async submitForm() {
    this.isLoading = true
    if (this.form.valid) {
      this.authService.signUpAdmin(this.form.value).pipe(
        catchError((e) => {
          console.log(e);

          this.isLoading = false
          return []
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe((v) => {
        console.log(v);

        this.isLoading = false
        this.authService.checkAdminRegistration.next()
      })
    }
  }

}