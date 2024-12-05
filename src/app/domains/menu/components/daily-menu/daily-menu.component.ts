import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { CheckoutService } from '../../services/checkout.service'
import { fadeInOnEnterAnimation, rubberBandOnEnterAnimation } from 'angular-animations'
import { PlateDetailComponent } from '../plate-detail/plate-detail.component'
import { Order } from '../../utils/waiter.model'
import { MenuService } from '../../services/menu.service'
import { Recipe, RecipeProtein } from '../../../recipe/utils/recipe.model'

@Component({
  selector: 'app-daily-menu',
  templateUrl: './daily-menu.component.html',
  styleUrls: ['./daily-menu.component.scss'],
  animations: [fadeInOnEnterAnimation(), rubberBandOnEnterAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyMenuComponent implements OnInit {
  menuTableArray = new Array()
  barTableArray = new Array()

  dailyMenu: any
  alaCarteList: Array<Recipe & { isRemoved: boolean }>
  readonly dailyMenuLabel = 'Daile Menu'
  readonly alaCarteLabel = 'A la Carte'
  plateOrder: Order = {}
  plateList

  chosenPlates = []
  chosenAlaCarteItems = []
  dishAmount: number = 0

  isMenuUpdated: boolean
  hasNoOrder: boolean
  hasEmptyMenu: boolean

  hasDeleteAuth: boolean
  menuEntry: any

  setProteinImage = (protein: RecipeProtein) => '/assets/images/' + protein + '.png'

  // TODO
  readonly isDesktop = window.screen.width > 760

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private menuService: MenuService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initServerData()
  }

  initServerData() {
    this.menuService.getDailyMenu().subscribe((value: any) => {
      if (value?.open) {
        this.dailyMenu = value
        this.isMenuUpdated = true
        this.cdr.markForCheck()
      } else {
        this.hasEmptyMenu = true
        this.isMenuUpdated = false
      }
    })
    this.menuService.getAlaCarteList().subscribe((value: any) => {
      this.alaCarteList = value
      console.log(value)
    })
  }

  addItem(item) {
    this.chosenPlates.push(item)
    this.dishAmount++
    this.cdr.markForCheck()
  }

  addAlaCarteItem(item) {
    this.chosenAlaCarteItems.push(item)
    this.dishAmount++
    this.cdr.markForCheck()
  }

  removeItem(name): void {
    const index = this.chosenPlates.indexOf(name)
    if (index >= 0) {
      this.dishAmount--
      this.chosenPlates.splice(index, 1)
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
    this.menuService.order.isComposed = true
    this.menuService.order.main = this.chosenPlates
    this.menuService.order.extra = this.dailyMenu.extra
    this.menuService.order.alacarte = this.chosenAlaCarteItems
    this.router.navigate(['/menu/checkout'])
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
