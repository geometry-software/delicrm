import { ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router, Scroll } from '@angular/router'
import { combineLatest, filter, map, switchMap, tap } from 'rxjs'
import { isEqual } from 'lodash'
import { Store } from '@ngrx/store'
import { AdminActions, AdminActions as ItemActions } from '../../store/admin.actions'
import { AppConfirmationDialogComponent } from '../../../../shared/components/app-confirmation-dialog/app-confirmation-dialog.component'
import { RestaurantService } from '../../services/restaurant.service'
import { getRestaurantInfo, loadingStatus } from '../../store/admin.selectors'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { RestaurantFormComponent } from '../restaurant-form/restaurant-form.component'
import { SharedConstants } from '../../../../shared/utils/shared.constants'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { SignalService } from '../../../../shared/services/signal.service'

@Component({
  selector: 'app-board-layout',
  templateUrl: './board-layout.component.html',
  styleUrls: ['./board-layout.component.scss'],
})
export class BoardLayoutComponent implements OnInit {

  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private restaurantService: RestaurantService,
    private store: Store,
    private cdr: ChangeDetectorRef,
    private signalService: SignalService,
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
  readonly formRoute = '/admin/form'
  readonly LoadingStatus = LoadingStatus
  readonly formComponentConfig = SharedConstants.formComponentConfig
  readonly loadingStatus = this.store.select(loadingStatus)
  readonly disabledClearMenu = combineLatest([
    this.loadingStatus,
    this.restaurantService.getDailyMenu().pipe(map(value => value.open)),
    // this.store.select(getRestaurantInfo).pipe
  ]).pipe(map(([loading, open]) => (loading === LoadingStatus.Loading) || !open))

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
    this.store.dispatch(ItemActions.printMenu())
  }

  clearMenu() {
    this.matDialog.open(AppConfirmationDialogComponent, {
      ...this.formComponentConfig,
      data: {
        title: 'Clear menu',
        subtitle: 'Are you sure you want to clear the menu?',
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

}