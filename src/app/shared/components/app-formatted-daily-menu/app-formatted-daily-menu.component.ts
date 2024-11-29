import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { RecipeProtein } from '../../../domains/recipe/utils/recipe.model'

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

  setProteinImage = (protein: RecipeProtein) => '/assets/images/' + protein + '.png'

  open(item, index) {
    this.openDetail.next({ item: item, index: index })
  }

  add(item) {
    this.addItem.next(item)
  }
}
