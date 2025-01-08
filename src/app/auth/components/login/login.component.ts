import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core'
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators'
import { AuthService } from '../../services/auth.service'
import { adminFormGroup, AdminFormProps, adminLoginFormGroup } from '../../models/admin.form'
import { showFieldErrors } from '../../../shared/utils/form-error-handling'
import { AuthConstants } from '../../models/auth.constants'
import { RestaurantFormComponent } from '../../../domains/admin/components/restaurant-form/restaurant-form.component'
import { MatDialog } from '@angular/material/dialog'
import { RestaurantService } from '../../../domains/admin/services/restaurant.service'
import { BehaviorSubject, of } from 'rxjs'
import { RestaurantLoadingStatus } from '../../models/loading-status'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { UserService } from '../../../domains/users/services/user.service'
import { SharedConstants } from '../../../shared/utils/shared.constants'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {

  constructor(
    private restaurantService: RestaurantService,
    private authService: AuthService,
    private userService: UserService,
    private matDialog: MatDialog,
    private destroyRef: DestroyRef
  ) { }

  form = adminLoginFormGroup
  formProps = AdminFormProps
  isAdminLoginLoading: boolean

  readonly googleIconPath = AuthConstants.googleIconPath
  readonly adminCollectionId = AuthConstants.adminCollectionId
  readonly restaurantFormComponentConfig = SharedConstants.formComponentConfig
  readonly adminForm = adminFormGroup
  readonly adminFormProps = AdminFormProps
  readonly isAdminUser = this.authService.isAdminUser
  readonly adminEmailWasVerified = this.authService.isAdminEmailVerified
  readonly RestaurantLoadingStatus = RestaurantLoadingStatus
  readonly restaurantRegisterStatus = new BehaviorSubject(RestaurantLoadingStatus.NotRegistered)

  displayName = this.authService.firebaseUser.pipe(
    tap(v => console.log(v)),
    map(auth => auth?.displayName ?? '123')
  )
  hasFirebasAuth
  registerRestaurantErrorMessage: string

  showFieldErrors = showFieldErrors

  loginUser() {
    this.authService.linkWithGoogle().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(v => console.log(v))
  }

  async submitAdminLoginForm() {
    this.isAdminLoginLoading = true
    if (this.form.valid) {
      this.authService.loginAdmin(this.form.value[AdminFormProps.email], this.form.value[AdminFormProps.password]).pipe(
        catchError(() => {
          this.isAdminLoginLoading = false
          return []
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        this.isAdminLoginLoading = false
        this.authService.checkAdminRegistration.next()
      })
    }
  }

  registerRestaurant() {
    this.matDialog.open(RestaurantFormComponent, this.restaurantFormComponentConfig)
      .afterClosed().pipe(
        filter(Boolean),
        tap(() => this.restaurantRegisterStatus.next(RestaurantLoadingStatus.Registering)),
        switchMap(value => this.userService.createAdminUser(this.adminCollectionId).pipe(
          switchMap(() => this.restaurantService.createRestaurant(value).pipe(
            switchMap(() => this.authService.deleteAdminAuth().pipe(
              tap(() => this.restaurantRegisterStatus.next(RestaurantLoadingStatus.RegisterSuccess)),
              catchError(error => this.handleRegisterRestaurantError(error)))),
            catchError(error => this.handleRegisterRestaurantError(error)))),
          catchError(error => this.handleRegisterRestaurantError(error)))),
        takeUntilDestroyed(this.destroyRef))
      .subscribe(error => this.registerRestaurantErrorMessage = error)
  }

  sendEmail() {
    this.authService.sendEmailVerification().subscribe()
  }

  private handleRegisterRestaurantError(error) {
    this.restaurantRegisterStatus.next(RestaurantLoadingStatus.RegisterFailed)
    return of(error)
  }

}