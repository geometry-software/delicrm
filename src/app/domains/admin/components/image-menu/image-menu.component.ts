import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { OrderService } from '../../../orders/services/order.service'
import { saveAs } from 'file-saver'
import * as moment from 'moment'
import { AdminService } from '../../services/admin.service'
import { Observable, filter, tap } from 'rxjs'
import domtoimage from 'dom-to-image'
import { Store } from '@ngrx/store'
import { printMenu } from '../../store/admin.selectors'
import { AdminActions as ItemActions } from '../../store/admin.actions'
import { Order } from '../../../menu/utils/menu.model'
@Component({
  selector: 'app-image-menu',
  templateUrl: './image-menu.component.html',
  styleUrls: ['./image-menu.component.scss'],
})
export class ImageMenuComponent implements OnInit {
  menuTitle = 'Deli CRM'

  isMenuPublished: boolean
  dailyMenu: any
  mainDishes: any[]

  plateList
  plateOrder: Order = {}

  selectable = true
  removable = true

  showForm: boolean
  isLoading: boolean

  commonImg = 'assets/dish.png'

  today = moment(new Date()).locale('es').format('dddd DD MMMM')

  domtoimage = domtoimage

  readonly printedMenu: Observable<boolean> = this.store.select(printMenu)

  ordersAmountList = new Array()
  ordersOpen: any = {} as any
  enableCloseDay: boolean
  isUpdating: boolean

  constructor(private orderService: OrderService, private adminService: AdminService, private store: Store) { }

  ngOnInit() {
    this.initServerData()
    this.initPaidOrders()
    this.verifyOpenOrders()
  }

  initPaidOrders() {
    this.orderService.getPaidOrders().subscribe((res) => {
      this.ordersAmountList = res
    })
    this.printedMenu
      .pipe(
        tap(value => {
          if (value) {
            this.print()
          }
        })
      )
      .subscribe()
  }

  initServerData() {
    this.adminService
      .getDailyMenu()
      .pipe(
        filter((value: any) => Boolean(value?.open))
      )
      .subscribe((value: any) => {
        this.isMenuPublished = true
        this.dailyMenu = value
      })
  }

  print() {
    this.isLoading = true
    let name = 'Menu ' + this.today
    this.domtoimage.toBlob(document.getElementById('print')).then((blob) => {
      saveAs(blob, name)
      this.store.dispatch(ItemActions.printMenu({ print: false }))
    })
  }

  deleteItem(id) {
    this.adminService.delete(id)
  }

  verifyOpenOrders() {
    this.orderService.getDeliveryOrders().subscribe((res) => {
      this.ordersOpen.delivery = res.length
    })
  }
}
