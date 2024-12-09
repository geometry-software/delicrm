import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  selector: 'app-title-item',
  templateUrl: './app-title-item.component.html',
  styleUrls: ['./app-title-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTitleItemComponent {

  @Input()
  title: string

  @Input()
  value: string | number

}