import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import { AuthService } from '../../services/auth.service'
import { UserService } from '../../../domains/users/services/user.service'
import { filter, switchMap, tap } from 'rxjs'
import { TranslateService } from '@ngx-translate/core'
import { SessionService } from '../../services/session.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private userService: UserService,
    private translateService: TranslateService,
  ) { }

  readonly userData = this.sessionService.getUser().pipe(
    filter(Boolean),
    switchMap(user => this.userService.getById(user.userId)),)
  readonly versionBuildDate: string = '29th of January 2025'

  logout() {
    this.authService.logout()
  }

  getVersion() {
    const message = this.translateService.instant("PROFILE.VERSION_UPDATED")
    return message + ' ' + this.versionBuildDate
  }

}