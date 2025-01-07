import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { setProteinImage } from '../../utils/protein-image'
import { DailyMenu } from '../../../domains/admin/models/restaurant'

@Component({
  selector: 'app-formatted-daily-menu',
  templateUrl: './app-formatted-daily-menu.component.html',
  styleUrls: ['./app-formatted-daily-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFormattedDailyMenuComponent {

  @Input()
  dailyMenu: DailyMenu

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