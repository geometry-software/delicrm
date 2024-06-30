import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-address',
  templateUrl: './app-address.component.html',
  styleUrls: ['./app-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppAddressComponent {}
