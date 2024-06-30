import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-info',
  templateUrl: './app-info.component.html',
  styleUrls: ['./app-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppInfoComponent {
  firstImg = '/assets/pwa/1.png'
  secondImg = '/assets/pwa/2.png'
  thirdImg = '/assets/pwa/3.png'
  forthImg = '/assets/pwa/4.png'
  fifthImg = '/assets/pwa/5.png'
}
