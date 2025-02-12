import { ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router, Scroll } from '@angular/router'
import { combineLatest, filter, first, map, switchMap, tap } from 'rxjs'
import { isEqual } from 'lodash'
import { Store } from '@ngrx/store'
import { AdminActions } from '../../store/admin-store/admin.actions'
import { AppConfirmationDialogComponent } from '../../../../shared/components/app-confirmation-dialog/app-confirmation-dialog.component'
import { getRestaurantInfo, isRestaurantOpen, loadingStatus } from '../../store/admin-store/admin.selectors'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { RestaurantFormComponent } from '../restaurant-form/restaurant-form.component'
import { SharedConstants } from '../../../../shared/utils/shared.constants'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { SignalService } from '../../../../shared/services/signal.service'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-board-layout',
  templateUrl: './board-layout.component.html',
  styleUrls: ['./board-layout.component.scss'],
})
export class BoardLayoutComponent implements OnInit {

  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private store: Store,
    private cdr: ChangeDetectorRef,
    private signalService: SignalService,
    private translateService: TranslateService,
    private destroyRef: DestroyRef
  ) { }

  readonly buttonTitleUpdate = 'Update'
  readonly buttonTitleClean = 'Clean'
  readonly buttonTitleDownload = 'Download'
  readonly buttonTitleConf = 'Config'

  readonly buttonTitleBack = 'Back'
  readonly buttonTitleRebuild = 'Rebuild'
  readonly buttonTitleAdditional = 'Additional'
  readonly buttonTitleMenu = 'Daily menu'

  readonly imageRoute = '/admin'
  readonly formRoute = '/admin/daily'
  readonly alacarteRoute = '/admin/alacarte'
  readonly LoadingStatus = LoadingStatus
  readonly formComponentConfig = SharedConstants.formComponentConfig
  readonly loadingStatus = this.store.select(loadingStatus)
  readonly disabledMenu = combineLatest([
    this.loadingStatus,
    this.store.select(isRestaurantOpen)
  ]).pipe(map(([loading, open]) =>
    loading === LoadingStatus.Loading || loading === LoadingStatus.NotLoaded || !open))

  currentRoute: string

  ngOnInit() {
    this.getCurrentRoute()
  }

  getCurrentRoute() {
    this.router.events.pipe(
      filter((value: Scroll) => !!value.routerEvent?.url),
      tap(value => {
        this.currentRoute = value.routerEvent.url
        this.cdr.markForCheck()
      })
    ).subscribe()
  }

  printMenu() {
    this.store.dispatch(AdminActions.printMenu())
  }

  clearMenu() {
    this.matDialog.open(AppConfirmationDialogComponent, {
      ...this.formComponentConfig,
      data: {
        title: 'ADMIN.BOARD.CLOSE_SERVICE.CONFIRMATION.TITLE',
        subtitle: 'ADMIN.BOARD.CLOSE_SERVICE.CONFIRMATION.SUBTITLE'
      }
    }).afterClosed().pipe(
      filter(Boolean),
      tap(() => this.store.dispatch(AdminActions.closeShift())),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
  }

  updateRestaurant() {
    this.signalService.setLoadingStatus(LoadingStatus.Loading)
    this.store.select(getRestaurantInfo).pipe(
      first(),
      tap(() => this.signalService.setLoadingStatus(LoadingStatus.Loaded)),
      switchMap(info => this.matDialog.open(RestaurantFormComponent,
        { ...this.formComponentConfig, data: info }
      ).afterClosed().pipe(
        filter(Boolean),
        filter(restaurant => !isEqual(info, restaurant)),
        tap(restaurant => this.store.dispatch(AdminActions.updateRestaurant({ restaurant }))))),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
  }

  rebuild() {
    this.store.dispatch(AdminActions.rebuildDailyMenu())
  }

  copy() {
    this.store.dispatch(AdminActions.copyDailyMenu())
  }

}