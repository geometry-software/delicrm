import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { Observable, combineLatest, tap } from 'rxjs'
import { cloneDeep } from 'lodash'
import {
  zoomOutUpOnLeaveAnimation,
  expandOnEnterAnimation,
  collapseOnLeaveAnimation,
  fadeInUpOnEnterAnimation,
  fadeInOnEnterAnimation,
} from 'angular-animations'
import { OrderDeliveryTime, Order, OrderType, OrderProgress } from '../../../orders/models/order.model'
import { MenuActions as ItemActions } from '../../store/menu.actions'
import { Recipe } from '../../../recipe/models/recipe.model'
import { User } from '../../../users/models/user.model'
import { UserService } from '../../../users/services/user.service'
import { MenuConstants } from '../../utils/menu.constants'
import { Store } from '@ngrx/store'
import { getExtra, getOrder, loadingStatus } from '../../store/menu.selectors'
import { Router } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Delivery } from '../../../delivery/models/delivery.model'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { showFieldErrors } from '../../../../shared/utils/form-error-handling'
import { tableZeroNumberValidator } from '../../utils/table-zero-number-validator'
import { Auth } from '../../../../auth/models/auth.model'
import { PaymentType } from '../../models/checkout'

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

  order: Order
  extra: any

  hasDelivery: boolean
  deliveryTime: OrderDeliveryTime = 'now'
  isCash: boolean
  changeTypes: Array<string> = ['Exact value', '10', '20', '50', '100']

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

  user: User
  auth: Auth

  readonly PaymentType = PaymentType

  get total() {
    return this.order.price.total + ' ' + this.order.price.currency
  }

  get deliveryPrice() {
    return this.order.price.delivery + ' ' + this.order.price.currency
  }

  get orderPrice() {
    return this.order.price.order + ' ' + this.order.price.currency
  }

  get alacartePrice() {
    return this.order.price.alacarte + ' ' + this.order.price.currency
  }

  ngOnInit() {
    this.initData()
  }

  initData() {
    combineLatest([
      this.store.select(getOrder),
      this.store.select(getExtra),
      this.userService.appUser,
      this.userService.appAuth,
    ]).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(([order, extra, user, auth]) => {
      if (!order) {
        this.router.navigate(['/menu'])
      } else {
        this.order = cloneDeep(order)
        this.extra = extra
        this.user = user
        if (!this.user) {
          this.auth = auth
          this.order.category.type = 'delivery'
          this.order.category.delivery = {}
          this.chooseOrderType('delivery')
        }
      }
    })
  }

  updatePaymentType(type: PaymentType) {
    if (type == PaymentType.Cash) {
      this.isCash = true
      this.form.get('change').setValidators([Validators.required])
    } else {
      this.isCash = false
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

  chooseSideDish(event: Recipe, i) {
    const name = event.name
    const id = event.id
    switch (event.type) {
      case 'salad':
        if (this.order.main[i].salad.id !== id) {
          this.order.main[i].salad = { id, name }
        } else {
          this.order.main[i].salad.id = null
        }
        break;
      case 'rice':
        if (this.order.main[i].rice.id !== id) {
          this.order.main[i].rice = { id, name }
        } else {
          this.order.main[i].rice.id = null
        }
        break;
      case 'garnish':
        if (this.order.main[i].garnish.id !== id) {
          this.order.main[i].garnish = { id, name }
        } else {
          this.order.main[i].garnish.id = null
        }
        break;
      case 'dessert':
        if (this.order.main[i].dessert.id !== id) {
          this.order.main[i].dessert = { id, name }
        } else {
          this.order.main[i].dessert.id = null
        }
        break;
    }
  }

  setDeliveryTime(event: string) {
    console.log(this.order);

    this.order.category.delivery.time = event
  }

  updateTime(time: OrderDeliveryTime) {
    console.log(time);

    this.deliveryTime = time
    if (time === 'now') this.order.category.delivery.time = 'now'
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
        this.order.category.delivery = {}
        this.order.category.table = null
        break
      case 'table':
        this.removeAllFormControls()
        this.form.addControl('table', new FormControl(null, [Validators.required, tableZeroNumberValidator()]))
        this.form.addControl('comment', new FormControl(null))
        this.order.category.delivery = null
        break
      case 'takeaway':
        this.removeAllFormControls()
        this.form.addControl('name', new FormControl(null, Validators.required))
        this.form.addControl('comment', new FormControl(null))
        this.order.category.delivery = null
        this.order.category.table = null
        break
    }
    this.order.category.type = type
    this.form.updateValueAndValidity()
  }

  submitOrderDetails() {
    this.resetValidation()
    if (!this.hasSkippedStarter && !this.hasSkippedDrink && this.form.valid) {
      this.formatOrder()
      // debug
      console.log(this.order);
      // if (this.user) {
      //   this.confirmTableOrder()
      // } else {
      //   this.confirmDelivery()
      // }
    } else {
      console.log(this.form);

      this.hightlightValidation()
    }
  }

  private formatOrder() {
    switch (this.order.category.type) {
      case 'delivery':
        console.log(this.order);
        this.order.category.delivery = {
          time: this.order.category?.delivery?.time ?? 'now',
          ...this.form.value,
        }
        this.order.category.client = this.form.value.name
        break
      case 'table':
        this.order.category.table = this.form.value.table
        break
      case 'takeaway':
        this.order.category.client = this.form.value.name
        break
    }
    if (!this.user) {
      this.order.status = 'requested'
      this.order.progress = '0%'
      this.order.statusHistory.push({
        status: 'requested',
        createdBy: this.auth,
        createdAt: this.order.createdAt
      })
    } else {
      this.order.status = 'cooking'
      this.order.progress = '50%'
      this.order.statusHistory.push({
        status: 'cooking',
        createdBy: this.user,
        createdAt: this.order.createdAt
      })
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

  private confirmDelivery() {
    const delivery: Delivery = {
      client: this.auth,
      createdAt: this.order.createdAt,
      order: this.order,
      status: 'requested',
      statusHistory: [{
        status: 'requested',
        createdBy: this.user ?? this.auth,
        createdAt: this.order.createdAt
      }],
      user: this.user,
      deliveryInfo: this.user.auth.deliveryInfo
    }
    this.store.dispatch(ItemActions.createDeliveryOrder({ delivery }))
  }

  private confirmTableOrder() {
    this.store.dispatch(ItemActions.createTableOrder({ order: this.order }))
  }

}