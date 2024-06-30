import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-table-link',
  templateUrl: './app-table-link.component.html',
  styleUrls: ['./app-table-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTableLinkComponent {
  @Input()
  item: any
  @Input()
  loading: boolean
  @Output()
  redirect = new EventEmitter()
}
