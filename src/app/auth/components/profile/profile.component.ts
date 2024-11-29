import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import { Store } from '@ngrx/store'
import { map, shareReplay, tap } from 'rxjs'
import { AuthService } from '../../services/auth.service'
import { AuthConstants } from '../../models/auth.constants'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {

  private readonly adminProviderId = AuthConstants.adminProviderId

  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  readonly authUser = this.authService.fireAuthUser
  readonly authUserHasVerifiedEmail = this.authUser.pipe(
    map(value => value.emailVerified && value.providerId === this.adminProviderId)
  )

  userData
  userId: string

  isClient: boolean
  isEmployee: boolean
  clientData
  employeeData

  datasource = new MatTableDataSource()
  displayedColumns = ['date', 'price']

  clientForm: FormGroup
  restaurantForm: FormGroup

  isLoaded: boolean
  versionBuildDate: string = 'on the 29th of November 2024'



  ngOnInit() {
    this.initForm()
    this.getUserData()
  }

  getUserData() {

    // this.userService
    //   .getAppAuth()
    //   .pipe(
    //     tap((value) => {
    //       console.log(value)
    //       if (value) {
    //         this.userData = value
    //         this.userId = value.uid
    //         this.clientForm.patchValue(value)
    //       }

    //       this.cdr.markForCheck()
    //     })
    //   )
    //   .subscribe()

    // this.userService
    //   .getRestaurant()
    //   .pipe(
    //     tap((value) => {
    //       console.log(value)
    //       this.restaurantForm.patchValue(value)
    //       this.cdr.markForCheck()
    //     })
    //   )
    //   .subscribe()
  }

  initForm() {
    this.clientForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      address: [null, [Validators.required]],
      phone: [null, [Validators.required]],
    })
    this.restaurantForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      address: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      delivery: [0, [Validators.required]],
      discount: [0, [Validators.required]],
    })
  }

  updateClientData(form) {
    // this.daoClient.updateDocument(this.userId, form.value).then(() => {
    //   this.isLoaded = true
    //   setTimeout(() => {
    //     this.isLoaded = false
    //   }, 2000)
    // })
  }

  updateRestaurantData(form) {
    // this.userService.updateRestaurant(form.value)
  }

  logout() {
    // this.store.dispatch(ItemActions.logOut())
  }
}
