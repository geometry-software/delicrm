import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { AuthService } from '../../services/auth.service'
import { adminFormGroup, AdminFormProps } from '../../models/admin.form'
import { showFieldErrors } from '../../../shared/utils/form-error-handling'
import { Router } from '@angular/router'
import { tap } from 'rxjs'

@Component({
  selector: 'app-admin-sign-up',
  templateUrl: './admin-sign-up.component.html',
  styleUrls: ['./admin-sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSignUpComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private destroyRef: DestroyRef
  ) { }

  form = adminFormGroup
  formProps = AdminFormProps
  showFieldErrors = showFieldErrors

  submitForm() {
    if (this.form.valid) {
      this.authService.signUpAdmin(this.form.value)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap(() => this.router.navigate(['/auth/profile'])))
        .subscribe()
    }
  }

}