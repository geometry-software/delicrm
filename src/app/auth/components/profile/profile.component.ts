import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { AuthActions as ItemActions } from '../../store/auth.actions'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import { Store } from '@ngrx/store'
import { AuthService } from '../../services/auth.service'
import { tap } from 'rxjs'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
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
  versionBuildDate: string = '30 of June 2024'

  constructor(
    private store$: Store,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.initForm()
    this.getUserData()
  }

  getUserData() {
    this.authService
      .getAppAuth()
      .pipe(
        tap((value) => {
          console.log(value)
          if (value) {
            this.userData = value
            this.userId = value.uid
            this.clientForm.patchValue(value)
          }

          this.cdr.markForCheck()
        })
      )
      .subscribe()

    this.authService
      .getRestaurant()
      .pipe(
        tap((value) => {
          console.log(value)
          this.restaurantForm.patchValue(value)
          this.cdr.markForCheck()
        })
      )
      .subscribe()
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
    this.authService.updateRestaurant(form.value)
  }

  logout() {
    this.store$.dispatch(ItemActions.logOut())
  }
}
