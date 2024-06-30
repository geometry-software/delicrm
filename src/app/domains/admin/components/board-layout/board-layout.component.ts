import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router, Scroll } from '@angular/router'
import { AdminService } from '../../services/admin.service'
import { SignalService } from 'src/app/shared/services/signal.service'
import { AppConfirmationDialogComponent } from 'src/app/shared/components/app-confirmation-dialog/app-confirmation-dialog.component'
import { distinctUntilChanged, filter, tap } from 'rxjs'
import { Store } from '@ngrx/store'
import { AdminActions as ItemActions } from '../../store/admin.actions'

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
    private store$: Store
  ) { }

  ngOnInit() {
    this.getCurrentRoute()
  }

  getCurrentRoute() {
    this.router.events
      .pipe(
        filter((value: Scroll) => !!value.routerEvent?.url),
        distinctUntilChanged(),
        tap((value: Scroll) => (this.currentRoute = value.routerEvent.url))
      )
      .subscribe()
  }

  printMenu() {
    this.store$.dispatch(ItemActions.printMenu({ print: true }))
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
        this.adminService.createDocument([]).then((res) => {
          this.adminService.clearDailyMenu().then(() => { })
        })
      }
    })
  }
}
