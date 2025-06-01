import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { setProteinImage } from '../../utils/protein-image'
import { MenuItem } from '../../../domains/admin/models/restaurant'

@Component({
    selector: 'app-alacarte-menu',
    templateUrl: './app-alacarte-menu.component.html',
    styleUrls: ['./app-alacarte-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AppAlacarteMenuComponent {

  @Input()
  showAdd: boolean

  @Input()
  showCheck: boolean

  @Input()
  showIndex: boolean

  @Input()
  alacarteMenu: MenuItem[]

  @Output()
  openDetail = new EventEmitter()

  @Output()
  addItem = new EventEmitter()

  setProteinImage = setProteinImage

  open(item) {
    this.openDetail.next(item)
  }

  add(item) {
    this.addItem.next(item)
  }

}