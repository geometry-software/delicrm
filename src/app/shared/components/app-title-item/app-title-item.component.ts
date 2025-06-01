import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core'

@Component({
    selector: 'app-title-item',
    templateUrl: './app-title-item.component.html',
    styleUrls: ['./app-title-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AppTitleItemComponent {

  @Input()
  @HostBinding('style.margin-bottom')
  margin = '20px';

  @Input()
  title: string

  @Input()
  value: string | number

}