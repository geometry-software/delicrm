import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { fadeInOnEnterAnimation, fadeInUpOnEnterAnimation, rubberBandOnEnterAnimation } from 'angular-animations'
import { PlateDetailComponent } from '../plate-detail/plate-detail.component'
import { MenuActions as ItemActions } from '../../store/menu.actions'
import { Order } from '../../../orders/models/order.model'
import { Recipe } from '../../../recipe/models/recipe.model'
import { setProteinImage } from '../../../../shared/utils/protein-image'
import { MenuConstants } from '../../utils/menu.constants'
import { Store } from '@ngrx/store'
import { getCurrency, getMenu, getRestaurantInfo, isRestaurantOpen, loadingStatus } from '../../store/menu.selectors'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { MenuItem } from '../../../admin/models/restaurant'
import { TranslateService } from '@ngx-translate/core'
import { map } from 'rxjs'
import { UserService } from '../../../users/services/user.service'

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
})
export class DailyMenuComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private store: Store,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
    private userService: UserService,
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
  readonly user = this.userService.getUser()
  readonly serviceClosedSubtitle = this.store.select(getRestaurantInfo).pipe(
    map(value => this.translateService.instant('MENU.DAILY_MENU.CLOSED.SUBTITLE') + ' ' + value.openTime))

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
    if (!this.chosenDailyMenuItems.length) {
      this.emptyOrderError = true
    } else {
      this.emptyOrderError = false
      this.store.dispatch(ItemActions.setOrder({ main: this.chosenDailyMenuItems, alacarte: this.chosenAlaCarteItems }))
    }
  }

  openDetail(event) {
    const item = event.item
    const index = event.index
    const dialog = this.dialog.open(PlateDetailComponent, {
      width: '90%',
      height: 'auto',
      data: {
        plate: item,
        currency: this.currency,
        user: this.user,
      },
    })
    dialog.afterClosed().subscribe(value => {
      if (value == 'add') {
        this.addItem(item)
        this.cdr.markForCheck()
      }
      if (value == 'remove') {
        // this.menuEntry.plates[index].plato.isRemoved = true
        // TODO update menu
      }
    })
  }

  // openStarterDetail(item, index) {
  //   if (this.hasDeleteAuth) {
  //     let dialog = this.dialog.open(PlateDetailComponent, {
  //       width: '90%',
  //       height: 'auto',
  //       data: {
  //         starterDetail: true,
  //         plate: item,
  //       },
  //     })
  //     dialog.afterClosed().subscribe(value => {
  //       if (value == 'remove') {
  //         switch (item.type) {
  //           case 'Starters (fruit or soup)':
  //             this.menuEntry.starters.startersArray[index].isRemoved = true
  //             break
  //           case 'Drink (juice or lemonade)':
  //             this.menuEntry.starters.drinksArray[index].isRemoved = true
  //             break
  //           case 'Salad':
  //             this.menuEntry.starters.toppingsList[index].isRemoved = true
  //             break
  //           case 'Rice':
  //             this.menuEntry.starters.toppingsList[index].isRemoved = true
  //             break
  //           case 'Garnish':
  //             this.menuEntry.starters.toppingsList[index].isRemoved = true
  //             break
  //           case 'Dessert':
  //             this.menuEntry.starters.toppingsList[3].isRemoved = true
  //             break
  //         }
  //       }
  //     })
  //   }
  // }
}
