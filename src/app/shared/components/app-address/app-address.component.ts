import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { Restaurant } from '../../../domains/admin/models/restaurant'

@Component({
  selector: 'app-address',
  templateUrl: './app-address.component.html',
  styleUrls: ['./app-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppAddressComponent {

  @Input()
  restaurant: Restaurant | undefined

}
