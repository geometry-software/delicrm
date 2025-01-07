import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-users-layout',
  templateUrl: './users-layout.component.html',
  styleUrls: ['./users-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersLayoutComponent { }