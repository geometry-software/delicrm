import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  selector: 'app-table-loader',
  templateUrl: './app-table-loader.component.html',
  styleUrls: ['./app-table-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTableLoaderComponent {
  @Input()
  loading: boolean
}
