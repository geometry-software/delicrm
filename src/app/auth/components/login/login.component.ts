import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef } from '@angular/core'
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators'
import { AuthService } from '../../services/auth.service'
import { adminFormGroup, AdminFormProps, adminLoginFormGroup } from '../../models/admin.form'
import { showFieldErrors } from '../../../shared/utils/form-error-handling'
import { AuthConstants } from '../../models/auth.constants'
import { RestaurantFormComponent } from '../../../domains/admin/components/restaurant-form/restaurant-form.component'
import { MatDialog } from '@angular/material/dialog'
import { RestaurantService } from '../../../domains/admin/services/restaurant.service'
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs'
import { RestaurantLoadingStatus } from '../../models/loading-status'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { UserService } from '../../../domains/users/services/user.service'
import { SharedConstants } from '../../../shared/utils/shared.constants'
import { Router } from '@angular/router'
import { NotificationService } from '../../../shared/services/notification.service'
import { TranslateService } from '@ngx-translate/core'
import { User } from '../../../domains/users/models/user.model'
import { SessionService } from '../../services/session.service'
import { RecipeConstants } from '../../../domains/recipe/models/recipe.constants'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {

  constructor(
    private restaurantService: RestaurantService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private authService: AuthService,
    private userService: UserService,
    private sessionService: SessionService,
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private destroyRef: DestroyRef
  ) { }

  readonly form = adminLoginFormGroup
  readonly formProps = AdminFormProps

  readonly googleIconPath = AuthConstants.googleIconPath
  readonly adminCollectionId = AuthConstants.adminCollectionId
  readonly restaurantFormComponentConfig = SharedConstants.formComponentConfig
  readonly adminForm = adminFormGroup
  readonly adminFormProps = AdminFormProps
  readonly isAdminUser = this.authService.isAdminUser
  readonly isRequestedAuth = this.authService.isRequestedAuth
  readonly adminEmailWasVerified = this.authService.isAdminEmailVerified
  readonly RestaurantLoadingStatus = RestaurantLoadingStatus
  readonly restaurantRegisterStatus = new BehaviorSubject(RestaurantLoadingStatus.NotRegistered)
  readonly showFieldErrors = showFieldErrors

  isAdminLoginLoading: boolean
  registerRestaurantErrorMessage: string

  loginUser() {
    this.authService.linkWithGoogle().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
  }

  async submitAdminLoginForm() {
    this.isAdminLoginLoading = true
    if (this.form.valid) {
      this.authService.loginAdmin(this.form.value[AdminFormProps.email], this.form.value[AdminFormProps.password]).pipe(
        catchError(() => {
          this.isAdminLoginLoading = false
          return EMPTY
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
        tap(console.warn),
        filter(Boolean),
        tap(() => this.restaurantRegisterStatus.next(RestaurantLoadingStatus.Registering)),
        switchMap(value => this.userService.createAdminUser(this.adminCollectionId, value.contact).pipe(
          switchMap(user => this.restaurantService.createRestaurant(value).pipe(
            switchMap(() => this.authService.deleteAdminAuth().pipe(
              tap(() => this.redirectToAdmin(user)),
              catchError(error => this.handleRegisterRestaurantError(error)))),
            catchError(error => this.handleRegisterRestaurantError(error)))),
          catchError(error => this.handleRegisterRestaurantError(error)))),
        takeUntilDestroyed(this.destroyRef))
      .subscribe(error => this.registerRestaurantErrorMessage = error)
  }

  sendEmail() {
    this.authService.sendEmailVerification().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
  }

  update() {
    location.reload()
  }

  redirectToAdmin(user: User) {
    this.notificationService.success('AUTH.ADMIN.REGISTER_RESTAURANT.SUCCESS')
    this.sessionService.setUser(user)
    this.router.navigate([RecipeConstants.moduleUrl])
  }

  getNameTitle(name: string) {
    const message = this.translateService.instant('AUTH.LOGIN.EMPLOYEE.HEY')
    return message + ', ' + name
  }

  private handleRegisterRestaurantError(error) {
    this.restaurantRegisterStatus.next(RestaurantLoadingStatus.RegisterFailed)
    console.error(error)
    return of(error)
  }

}