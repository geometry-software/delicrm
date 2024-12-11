import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { MenuService } from '../../services/menu.service'
import { fadeInOnEnterAnimation, fadeInUpOnEnterAnimation, rubberBandOnEnterAnimation } from 'angular-animations'
import { PlateDetailComponent } from '../plate-detail/plate-detail.component'
import { MenuActions as ItemActions } from '../../store/menu.actions'
import { Order } from '../../utils/menu.model'
import { Recipe } from '../../../recipe/models/recipe.model'
import { setProteinImage } from '../../../../shared/utils/protein-image'
import { MenuConstants } from '../../utils/menu.constants'
import { Store } from '@ngrx/store'
import { getMenu, isRestaurantOpen, loadingStatus } from '../../store/menu.selectors'
import { LoadingStatus } from '../../../../shared/models/loading-status'

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
    private router: Router,
    private store: Store,
    private cdr: ChangeDetectorRef
  ) { }

  readonly dailyMenuLabel = MenuConstants.dailyMenuLabel
  readonly alaCarteLabel = MenuConstants.alaCarteLabel

  menuTableArray = new Array()
  barTableArray = new Array()

  alaCarteList: Array<Recipe & { isRemoved: boolean }>
  plateOrder: Order = {}
  plateList
  readonly chosenDailyMenuItems = []
  readonly chosenAlaCarteItems = []
  dishAmount: number = 0
  isMenuUpdated: boolean
  hasNoOrder: boolean
  hasEmptyMenu: boolean
  hasDeleteAuth: boolean
  menuEntry: any
  emptyOrderError: boolean

  // TODO move to a single const (another in navbar) and make dependent from prod env
  readonly isDesktop = window.screen.width > 760

  readonly setProteinImage = setProteinImage

  readonly LoadingStatus = LoadingStatus

  dailyMenu = this.store.select(getMenu)
  isRestaurantOpen = this.store.select(isRestaurantOpen)
  loadingStatus = this.store.select(loadingStatus)

  ngOnInit(): void {
    this.initServerData()
  }

  initServerData() {
    // this.restaurantService.getDailyMenu().subscribe((value: any) => {
    //   console.log(value);

    //   if (value?.open) {
    //     this.dailyMenu = value
    //     this.isMenuUpdated = true
    //     this.cdr.markForCheck()
    //   } else {
    //     this.hasEmptyMenu = true
    //     this.isMenuUpdated = false
    //   }
    // })
    // this.menuService.getAlaCarteList().subscribe((value: any) => {
    //   this.alaCarteList = value
    //   console.log(value)
    // })
  }

  addItem(item) {
    this.chosenDailyMenuItems.push(item)
    this.dishAmount++
    this.cdr.markForCheck()
  }

  addAlaCarteItem(item) {
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
    const order: Order = {
      main: this.chosenDailyMenuItems,
      alacarte: this.chosenAlaCarteItems
    }
    if (!order?.main?.length) {
      this.emptyOrderError = true
    } else {
      this.emptyOrderError = false
      this.store.dispatch(ItemActions.setOrder({ order }))
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
      },
    })
    dialog.afterClosed().subscribe(value => {
      if (value == 'add') {
        this.addItem(item)
        this.cdr.markForCheck()
      }
      if (value == 'remove') {
        this.menuEntry.plates[index].plato.isRemoved = true
        // TODO update menu
      }
    })
  }

  openStarterDetail(item, index) {
    if (this.hasDeleteAuth) {
      let dialog = this.dialog.open(PlateDetailComponent, {
        width: '90%',
        height: 'auto',
        data: {
          starterDetail: true,
          plate: item,
        },
      })
      dialog.afterClosed().subscribe(value => {
        if (value == 'remove') {
          switch (item.type) {
            case 'Starters (fruit or soup)':
              this.menuEntry.starters.startersArray[index].isRemoved = true
              break
            case 'Drink (juice or lemonade)':
              this.menuEntry.starters.drinksArray[index].isRemoved = true
              break
            case 'Salad':
              this.menuEntry.starters.toppingsList[index].isRemoved = true
              break
            case 'Rice':
              this.menuEntry.starters.toppingsList[index].isRemoved = true
              break
            case 'Garnish':
              this.menuEntry.starters.toppingsList[index].isRemoved = true
              break
            case 'Dessert':
              this.menuEntry.starters.toppingsList[3].isRemoved = true
              break
          }
        }
      })
    }
  }
}
