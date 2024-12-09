import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  selector: 'app-title',
  templateUrl: './app-title.component.html',
  styleUrls: ['./app-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTitleComponent {

  @Input()
  title: string

  @Input()
  subtitle: string

}