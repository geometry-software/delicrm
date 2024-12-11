import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router, Scroll } from '@angular/router'
import { AdminService } from '../../services/admin.service'
import { distinctUntilChanged, filter, map, tap } from 'rxjs'
import { Store } from '@ngrx/store'
import { AdminActions as ItemActions } from '../../store/admin.actions'
import { SignalService } from '../../../../shared/services/signal.service'
import { AppConfirmationDialogComponent } from '../../../../shared/components/app-confirmation-dialog/app-confirmation-dialog.component'
import { RestaurantService } from '../../services/restaurant.service'
import { loadingStatus } from '../../store/admin.selectors'
import { LoadingStatus } from '../../../../shared/models/loading-status'

@Component({
  selector: 'app-board-layout',
  templateUrl: './board-layout.component.html',
  styleUrls: ['./board-layout.component.scss'],
})
export class BoardLayoutComponent implements OnInit {
  readonly buttonTitleUpdate = 'Update'
  readonly buttonTitleClean = 'Clean'
  readonly buttonTitleDownload = 'Download'
  readonly buttonTitleConf = 'Config'

  readonly buttonTitleBack = 'Back'
  readonly buttonTitleRebuild = 'Rebuild'
  readonly buttonTitleAdditional = 'Additional'
  readonly buttonTitleMenu = 'Daily menu'

  readonly imageRoute = '/admin/board'
  readonly formRoute = '/admin/board/form'
  currentRoute: string

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private signalService: SignalService,
    private adminService: AdminService,
    private restaurantService: RestaurantService,
    private store: Store,
    private cdr: ChangeDetectorRef,
  ) { }

  LoadingStatus = LoadingStatus

  readonly loadingStatus = this.store.select(loadingStatus).pipe(
    // tap((v) => console.log(v)),
    // filter(value => value === LoadingStatus.Loading),
    // tap((v) => console.log(v)),
    // map(v => v ? true : false),
    // tap((v) => console.log(v))
  )

  ngOnInit() {
    this.getCurrentRoute()
  }

  getCurrentRoute() {
    this.router.events.pipe(
      filter((value: Scroll) => !!value.routerEvent?.url),
      tap((value: Scroll) => {
        this.currentRoute = value.routerEvent.url
        this.cdr.markForCheck()
      })
    ).subscribe()
  }

  printMenu() {
    console.log(1);

    this.store.dispatch(ItemActions.printMenu())
  }

  clearMenu() {
    let dialog = this.dialog.open(AppConfirmationDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        type: 'delete-menu',
      },
    })
    dialog.afterClosed().subscribe((res) => {
      if (res) {
        // this.menuList.closedAt = new Date()
        // this.menuList.amountOfPlate = this.menuList.plates.map((a) => a.plato.amount).reduce((a, b) => a + b, 0)
        // this.menuList.amountOfOrders = this.menuList.orders.length
        // this.menuList.amountOfCash = this.menuList.orders.map((a) => a.totalPrice).reduce((a, b) => a + b, 0)
        // this.menuList.amountOfBank = 0
        // this.adminService.createDocument([]).then((res) => {
        //   this.adminService.clearDailyMenu().then(() => { })
        // })

        this.restaurantService.clearDailyMenu()

      }
    })
  }

}