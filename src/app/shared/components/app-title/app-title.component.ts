import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core'

@Component({
  selector: 'app-title',
  templateUrl: './app-title.component.html',
  styleUrls: ['./app-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTitleComponent {

  @Input()
  @HostBinding('style.margin-bottom')
  margin = '20px';

  @Input()
  title: string

  @Input()
  subtitle: string

  @Input()
  disableTranslateTitle: boolean

  @Input()
  disableTranslateSubtitle: boolean

}