import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { catchError, concatMap, defaultIfEmpty, filter, map, switchMap, tap } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import { AuthService } from '../../services/auth.service'
import { adminFormGroup, AdminFormProps } from '../../models/admin.form'
import { showFieldErrors } from '../../../shared/utils/form-error-handling'
import { AuthConstants } from '../../models/auth.constants'
import { RestaurantFormComponent } from '../../../domains/admin/components/restaurant-form/restaurant-form.component'
import { MatDialog } from '@angular/material/dialog'
import { RestaurantService } from '../../../domains/admin/services/restaurant.service'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { RestaurantLoadingStatus } from '../../models/loading-status'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {

  constructor(
    private restaurantService: RestaurantService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private matDialog: MatDialog,
  ) { }

  private readonly adminProviderId = AuthConstants.adminProviderId

  readonly googleIconPath = AuthConstants.googleIconPath
  readonly adminForm = adminFormGroup
  readonly adminFormProps = AdminFormProps
  readonly isAdminUser = this.authService.isAdminUser
  readonly authUser = this.authService.fireAuthUser
  readonly adminEmailWasVerified = this.authService.isAdminEmailVerified

  showFieldErrors = showFieldErrors
  userDisplayName
  hasFirebasAuth

  registerRestaurantMessage: Observable<string> = of('Register Restaurant')
  RestaurantLoadingStatus = RestaurantLoadingStatus


  loginUser() {
    this.authService.loginGoogle()
  }

  loginAdmin() {

  }

  restaurantRegisterStatus = new BehaviorSubject(RestaurantLoadingStatus.NotRegistered)

  registerRestaurant() {
    this.registerRestaurantMessage = this.matDialog.open(RestaurantFormComponent, {
      width: '80%',
      height: '80%',
    }).afterClosed().pipe(
      filter(Boolean),
      tap(() => this.restaurantRegisterStatus.next(RestaurantLoadingStatus.Registering)),
      switchMap(value => this.authService.addAppUser('admin', 'admin').pipe(
        switchMap(() => this.restaurantService.create(value).pipe(
          tap(() => this.restaurantRegisterStatus.next(RestaurantLoadingStatus.RegisterSuccess)),
          catchError(error => this.handleRegisterRestaurantError(error)))),
        catchError(error => this.handleRegisterRestaurantError(error)))))
  }

  private handleRegisterRestaurantError(error) {
    this.restaurantRegisterStatus.next(RestaurantLoadingStatus.RegisterFailed)
    return of(error)
  }

}