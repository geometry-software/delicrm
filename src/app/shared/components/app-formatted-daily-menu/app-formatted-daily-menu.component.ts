import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { RecipeProtein } from '../../../domains/recipe/models/recipe.model'
import { setProteinImage } from '../../utils/protein-image'

@Component({
  selector: 'app-formatted-daily-menu',
  templateUrl: './app-formatted-daily-menu.component.html',
  styleUrls: ['./app-formatted-daily-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFormattedDailyMenuComponent {
  @Input()
  dailyMenu: any

  @Input()
  isAddAvailable: boolean

  @Output()
  openDetail = new EventEmitter()

  @Output()
  addItem = new EventEmitter()

  setProteinImage = setProteinImage

  open(item, index) {
    this.openDetail.next({ item: item, index: index })
  }

  add(item) {
    this.addItem.next(item)
  }

}