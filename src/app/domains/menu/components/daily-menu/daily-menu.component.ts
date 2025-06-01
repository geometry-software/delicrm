import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { fadeInOnEnterAnimation, fadeInUpOnEnterAnimation, rubberBandOnEnterAnimation } from 'angular-animations'
import { PlateDetailComponent } from '../plate-detail/plate-detail.component'
import { MenuActions as ItemActions } from '../../store/menu.actions'
import { setProteinImage } from '../../../../shared/utils/protein-image'
import { Store } from '@ngrx/store'
import { getAlacarte, getCurrency, getMenu, getRestaurantInfo, isRestaurantOpen, loadingStatus } from '../../store/menu.selectors'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { MenuItem } from '../../../admin/models/restaurant'
import { map } from 'rxjs'
import { SessionService } from '../../../../auth/services/session.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
    selector: 'app-daily-menu',
    templateUrl: './daily-menu.component.html',
    styleUrls: ['./daily-menu.component.scss'],
    animations: [
        fadeInOnEnterAnimation(),
        fadeInUpOnEnterAnimation(),
        rubberBandOnEnterAnimation()
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DailyMenuComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private store: Store,
    private cdr: ChangeDetectorRef,
    private sessionService: SessionService,
    private destroyRef: DestroyRef
  ) { }

  readonly chosenDailyMenuItems = []
  readonly chosenAlaCarteItems = []

  alaCarteList: Array<MenuItem>
  dishAmount: number = 0
  emptyOrderError: boolean

  // TODO move to a single const (another in navbar) and make dependent from prod env
  readonly isDesktop = window.screen.width > 760

  readonly setProteinImage = setProteinImage

  readonly LoadingStatus = LoadingStatus
  readonly dailyMenu = this.store.select(getMenu)
  readonly isRestaurantOpen = this.store.select(isRestaurantOpen)
  readonly restaurantInfo = this.store.select(getRestaurantInfo)
  readonly loadingStatus = this.store.select(loadingStatus)
  readonly currency = this.store.select(getCurrency)
  readonly alacarteMenu = this.store.select(getAlacarte)
  readonly user = this.sessionService.getUser()
  readonly serviceClosedSubtitle = this.store.select(getRestaurantInfo).pipe(
    map(value => value.closedTitle))

  ngOnInit(): void {
    this.store.dispatch(ItemActions.initDailyMenu())
  }

  addItem(item) {
    this.emptyOrderError = false
    this.chosenDailyMenuItems.push(item)
    this.dishAmount++
    this.cdr.markForCheck()
  }

  addAlaCarteItem(item) {
    this.emptyOrderError = false
    this.chosenAlaCarteItems.push(item)
    this.dishAmount++
    this.cdr.markForCheck()
  }

  removeItem(name): void {
    const index = this.chosenDailyMenuItems.indexOf(name)
    if (index >= 0) {
      this.dishAmount--
      this.chosenDailyMenuItems.splice(index, 1)
    }
  }

  removeAlaCarteItem(name): void {
    const index = this.chosenAlaCarteItems.indexOf(name)
    if (index >= 0) {
      this.dishAmount--
      this.chosenAlaCarteItems.splice(index, 1)
    }
  }

  save() {
    if (!this.chosenDailyMenuItems.length && !this.chosenAlaCarteItems.length) {
      this.emptyOrderError = true
    } else {
      this.emptyOrderError = false
      this.store.dispatch(ItemActions.setOrder({ main: this.chosenDailyMenuItems, alacarte: this.chosenAlaCarteItems }))
    }
  }

  openDetail(item: MenuItem) {
    this.dialog.open(PlateDetailComponent, {
      width: '90%',
      height: 'auto',
      data: {
        plate: item,
        currency: this.currency,
        user: this.user,
      },
    }).afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      if (value == 'add') {
        this.addItem(item)
        this.cdr.markForCheck()
      }
      if (value == 'remove') {
        if (item.type === 'alacarte') {
          this.store.dispatch(ItemActions.setAlacarteEightySix({ id: item.id }))
        } else {
          this.store.dispatch(ItemActions.setDailyMenuEightySix({ id: item.id }))
        }
      }
    })
  }

}