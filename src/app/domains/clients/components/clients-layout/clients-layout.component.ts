import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-clients-layout',
  templateUrl: './clients-layout.component.html',
  styleUrls: ['./clients-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsLayoutComponent { }