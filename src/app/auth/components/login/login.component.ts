import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core'
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators'
import { AuthService } from '../../services/auth.service'
import { adminFormGroup, AdminFormProps } from '../../models/admin.form'
import { showFieldErrors } from '../../../shared/utils/form-error-handling'
import { AuthConstants } from '../../models/auth.constants'
import { RestaurantFormComponent } from '../../../domains/admin/components/restaurant-form/restaurant-form.component'
import { MatDialog } from '@angular/material/dialog'
import { RestaurantService } from '../../../domains/admin/services/restaurant.service'
import { BehaviorSubject, of } from 'rxjs'
import { RestaurantLoadingStatus } from '../../models/loading-status'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { AdminConstants } from '../../../domains/admin/models/admin.constants'
import { UserService } from '../../../domains/users/services/user.service'
import { SharedConstants } from '../../../shared/utils/shared.constants'
import { Restaurant } from '../../../domains/admin/models/restaurant'
import { RestaurantConstants } from '../../../domains/admin/models/restaurant.constants'

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

  readonly googleIconPath = AuthConstants.googleIconPath
  readonly adminCollectionId = AuthConstants.adminCollectionId
  readonly restaurantFormComponentConfig = SharedConstants.formComponentConfig
  readonly defaultCurrency = RestaurantConstants.defaultCurrency
  readonly adminForm = adminFormGroup
  readonly adminFormProps = AdminFormProps
  readonly isAdminUser = this.authService.isAdminUser
  readonly authUser = this.authService.fireAuthUser
  readonly adminEmailWasVerified = this.authService.isAdminEmailVerified
  readonly RestaurantLoadingStatus = RestaurantLoadingStatus
  readonly restaurantRegisterStatus = new BehaviorSubject(RestaurantLoadingStatus.NotRegistered)

  userDisplayName
  hasFirebasAuth
  registerRestaurantErrorMessage: string

  showFieldErrors = showFieldErrors

  loginUser() {
    this.authService.loginGoogle()
  }

  loginAdmin() {
    this.authService.loginAdmin(
      this.adminForm.value[AdminFormProps.email],
      this.adminForm.value[AdminFormProps.password]
    )
  }

  registerRestaurant() {
    this.matDialog.open(RestaurantFormComponent, this.restaurantFormComponentConfig)
      .afterClosed().pipe(
        filter(Boolean),
        tap(() => this.restaurantRegisterStatus.next(RestaurantLoadingStatus.Registering)),
        map((value: Restaurant) => ({ ...value, currency: this.defaultCurrency })),
        switchMap(value => this.userService.createAdminUser(this.adminCollectionId, this.adminCollectionId).pipe(
          switchMap(() => this.restaurantService.createRestaurant(value).pipe(
            tap(() => this.restaurantRegisterStatus.next(RestaurantLoadingStatus.RegisterSuccess)),
            catchError(error => this.handleRegisterRestaurantError(error)))),
          catchError(error => this.handleRegisterRestaurantError(error)))),
        takeUntilDestroyed(this.destroyRef))
      .subscribe(error => this.registerRestaurantErrorMessage = error)
  }

  private handleRegisterRestaurantError(error) {
    this.restaurantRegisterStatus.next(RestaurantLoadingStatus.RegisterFailed)
    return of(error)
  }

}