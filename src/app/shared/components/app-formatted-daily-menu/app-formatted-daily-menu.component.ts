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

  @Input()
  currency: string

  @Output()
  openDetail = new EventEmitter()

  @Output()
  addItem = new EventEmitter()

  setProteinImage = setProteinImage

  open(item) {
    this.openDetail.next({ item: item, index: 0 })
  }

  add(item) {
    this.addItem.next(item)
  }

}