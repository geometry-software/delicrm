import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { Observable, combineLatest } from 'rxjs'
import { cloneDeep } from 'lodash'
import {
  zoomOutUpOnLeaveAnimation,
  expandOnEnterAnimation,
  collapseOnLeaveAnimation,
  fadeInUpOnEnterAnimation,
  fadeInOnEnterAnimation,
} from 'angular-animations'
import { Order, OrderType } from '../../../orders/models/order.model'
import { Recipe } from '../../../recipe/models/recipe.model'
import { MenuActions as ItemActions, MenuActions } from '../../store/menu.actions'
import { UserService } from '../../../users/services/user.service'
import { MenuConstants } from '../../utils/menu.constants'
import { Store } from '@ngrx/store'
import { getCurrency, getExtras, getOrder, loadingStatus } from '../../store/menu.selectors'
import { Router } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Delivery, DeliveryTime } from '../../../delivery/models/delivery.model'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { showFieldErrors } from '../../../../shared/utils/form-error-handling'
import { tableZeroNumberValidator } from '../../utils/table-zero-number-validator'
import { Auth } from '../../../../auth/models/auth.model'
import { PaymentType } from '../../models/checkout'
import { Extras } from '../../../admin/models/restaurant'
import { getCurrentUnixTime } from '../../../../shared/utils/format-unix-time'
import { User } from '../../../users/models/user.model'

@Component({
  selector: 'app-order-checkout',
  templateUrl: './order-checkout.component.html',
  styleUrls: ['./order-checkout.component.scss'],
  animations: [
    zoomOutUpOnLeaveAnimation(),
    expandOnEnterAnimation(),
    collapseOnLeaveAnimation(),
    fadeInUpOnEnterAnimation(),
    fadeInOnEnterAnimation(),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCheckoutComponent implements OnInit {

  constructor(
    private store: Store,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private destroyRef: DestroyRef
  ) { }

  readonly dailyMenuLabel = MenuConstants.dailyMenuLabel
  readonly alaCarteLabel = MenuConstants.alaCarteLabel

  readonly LoadingStatus = LoadingStatus
  readonly loadingStatus = this.store.select(loadingStatus)
  readonly showFieldErrors = showFieldErrors
  readonly PaymentType = PaymentType

  order: Order
  delivery: Delivery
  extras: Extras

  hasDelivery: boolean
  deliveryTime: DeliveryTime = 'now'
  delayedTime: string = ''
  paymentType = PaymentType.Card
  changeTypes: Array<string> = ['Exact value', '10', '20', '50', '100']
  currency: string

  form: FormGroup = this.formBuilder.group({
    table: [null, [Validators.required, tableZeroNumberValidator()]],
    comment: [null],
  })

  isOldClient: boolean = false
  clientFormControl = new FormControl()
  filteredClients: Observable<any[]>
  clientList = new Array()

  hasSkippedStarter: boolean
  hasSkippedDrink: boolean
  hasClientDataError: boolean
  hasStarterError: boolean
  hasDrinkError: boolean
  hasPaymentTypeError: boolean
  hasTableNumberError: boolean
  hasTakeAwayError: boolean

  appUser: User
  auth: Auth

  get total() {
    return this.order.price.total + ' ' + this.currency
  }

  get deliveryPrice() {
    return this.order.price.delivery + ' ' + this.currency
  }

  get orderPrice() {
    return this.order.price.order + ' ' + this.currency
  }

  get alacartePrice() {
    return this.order.price.alacarte + ' ' + this.currency
  }

  ngOnInit() {
    this.initData()
  }

  initData() {
    combineLatest([
      this.store.select(getOrder),
      this.store.select(getExtras),
      this.store.select(getCurrency),
      this.userService.getUser(),
      this.userService.getAuth()
    ]).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(([order, extras, currency, user, auth]) => {
      if (!order || !currency) {
        this.router.navigate(['/menu'])
      } else {
        this.order = cloneDeep(order)
        this.extras = extras
        this.currency = currency
        this.appUser = user
        if (!this.appUser) {
          this.auth = auth
          this.order.category.type = 'delivery'
          this.chooseOrderType('delivery')
          this.form.patchValue({
            name: this.auth.name,
            address: this.auth.address,
            phone: this.auth.phone
          })
        }
        this.cdr.markForCheck()
      }
    })
  }

  updatePaymentType(type: PaymentType) {
    this.paymentType = type
    if (type === PaymentType.Cash) {
      this.form.get('change').setValidators([Validators.required])
    } else {
      this.form.get('change').setValidators([])
      this.form.get('change').setValue(null)
    }
    this.form.updateValueAndValidity()
    this.cdr.markForCheck()
  }

  getDishTitle(i: number, name: string) {
    return i + 1 + '. ' + name
  }

  chooseStarter(event, i) {
    if (!event) {
      this.order.main[i].starter.id = null
    } else {
      this.order.main[i].starter = {
        id: event.id,
        name: event.name
      }
    }
  }

  chooseDrink(event, i) {
    if (!event) {
      this.order.main[i].drink.id = null
    } else {
      this.order.main[i].drink = {
        id: event.id,
        name: event.name
      }
    }
  }

  chooseSideDish(event: Recipe, index: number) {
    const name = event.name
    const id = event.id
    switch (event.type) {
      case 'salad':
        if (this.order.main[index].salad.id !== id) {
          this.order.main[index].salad = { id, name }
        } else {
          this.order.main[index].salad.id = null
        }
        break;
      case 'rice':
        if (this.order.main[index].rice.id !== id) {
          this.order.main[index].rice = { id, name }
        } else {
          this.order.main[index].rice.id = null
        }
        break;
      case 'garnish':
        if (this.order.main[index].garnish.id !== id) {
          this.order.main[index].garnish = { id, name }
        } else {
          this.order.main[index].garnish.id = null
        }
        break;
      case 'dessert':
        if (this.order.main[index].dessert.id !== id) {
          this.order.main[index].dessert = { id, name }
        } else {
          this.order.main[index].dessert.id = null
        }
        break;
    }
  }

  setDeliveryTime(event: string) {
    this.delayedTime = event
  }

  updateTime(time: DeliveryTime) {
    this.deliveryTime = time
  }

  displayFn(item): string {
    return item && item.name ? item.name : ''
  }

  filterAutocompleteName(name: string) {
    const filterValue = name.toLowerCase()
    return this.clientList.filter((option) => option.name.toLowerCase().indexOf(filterValue) === 0)
  }

  addClientData(item) {
    this.form.reset()
    this.form.patchValue(item)
  }

  removeAllFormControls() {
    this.form.removeControl('name')
    this.form.removeControl('address')
    this.form.removeControl('phone')
    this.form.removeControl('payment')
    this.form.removeControl('change')
    this.form.removeControl('comment')
    this.form.removeControl('table')
  }

  chooseOrderType(type: OrderType) {
    switch (type) {
      case 'delivery':
        this.removeAllFormControls()
        this.form.addControl('name', new FormControl(null, Validators.required))
        this.form.addControl('address', new FormControl(null, Validators.required))
        this.form.addControl('phone', new FormControl(null, Validators.required))
        this.form.addControl('payment', new FormControl(this.PaymentType.Card, Validators.required))
        this.form.addControl('change', new FormControl(null))
        this.form.addControl('comment', new FormControl(null))
        this.order.category.table = null
        break
      case 'table':
        this.removeAllFormControls()
        this.form.addControl('table', new FormControl(null, [Validators.required, tableZeroNumberValidator()]))
        this.form.addControl('comment', new FormControl(null))
        break
      case 'takeaway':
        this.removeAllFormControls()
        this.form.addControl('name', new FormControl(null, Validators.required))
        this.form.addControl('comment', new FormControl(null))
        this.order.category.table = null
        break
    }
    this.order.category.type = type
    this.form.markAsUntouched()
    this.form.updateValueAndValidity()
  }

  submitOrderDetails() {
    this.resetValidation()
    if (!this.hasSkippedStarter && !this.hasSkippedDrink && this.form.valid) {
      this.formatOrder()
      this.store.dispatch(MenuActions.checkoutOrder({ order: this.order }))
    } else {
      this.hightlightValidation()
    }
  }

  private formatOrder() {
    this.order.createdAt = getCurrentUnixTime()
    this.order.createdBy = this.appUser ? this.appUser : null
    switch (this.order.category.type) {
      case 'delivery':
        this.formatDeliveryOrder()
        break
      case 'table':
        this.formatTableOrder()
        break
      case 'takeaway':
        this.formatTakeawayOrder()
        break
    }
  }

  private resetValidation() {
    this.hasClientDataError = false
    this.hasStarterError = false
    this.hasDrinkError = false
    this.hasPaymentTypeError = false
    this.hasTakeAwayError = false
    this.hasTableNumberError = false
    this.hasSkippedStarter = Boolean(!this.order.main.find(el => Boolean(el.starter.name)))
    this.hasSkippedDrink = Boolean(!this.order.main.find(el => Boolean(el.drink.name)))
  }

  private hightlightValidation() {
    this.hasSkippedStarter ? (this.hasStarterError = true) : (this.hasStarterError = false)
    this.hasSkippedDrink ? (this.hasDrinkError = true) : (this.hasDrinkError = false)
    if (this.form.invalid) {
      switch (this.order.category.type) {
        case 'delivery':
          this.form.controls['payment'].hasError('required')
            ? (this.hasPaymentTypeError = true)
            : (this.hasPaymentTypeError = false)
          const nameError = this.form.controls['name'].hasError('required')
          const addressError = this.form.controls['address'].hasError('required')
          const phoneError = this.form.controls['phone'].hasError('required')
          if (nameError || addressError || phoneError) {
            this.hasClientDataError = true
          }
          break
        case 'table':
          this.form.controls['table'].errors['required']
            ? (this.hasTableNumberError = true)
            : (this.hasTableNumberError = false)
          break
        case 'takeaway':
          this.form.controls['name'].hasError('required')
            ? (this.hasTakeAwayError = true)
            : (this.hasTakeAwayError = false)
          break
      }
      this.form.markAllAsTouched()
    }
  }

  private formatTableOrder() {
    this.order.category = {
      table: null
    }
    this.order.category.type = 'table'
    this.order.category.table = this.form.value.table
  }

  private formatTakeawayOrder() {
    this.order.category = {}
    this.order.category.type = 'takeaway'
    this.order.category.clientName = this.form.value.name
  }

  private formatDeliveryOrder() {
    this.order.category = {
      clientName: null,
      table: null
    }
    this.order.category.type = 'delivery'
    this.order.category.delivery = {
      createdAt: getCurrentUnixTime(),
      createdByUser: this.appUser ? this.appUser : null,
      createdByClient: !this.appUser ? this.auth : null,
      order: cloneDeep(this.order),
      status: this.appUser ? 'confirmed' : 'requested',
      deliveryInfo: {
        name: this.form.value.name,
        phone: this.form.value.phone,
        address: this.form.value.address,
        time: this.deliveryTime,
        delayedTime: this.delayedTime,
        payment: this.paymentType,
        change: this.form.value.change,
      }
    }
  }

}