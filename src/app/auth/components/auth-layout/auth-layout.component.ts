import { ChangeDetectionStrategy, Component } from '@angular/core'
import { AuthService } from '../../services/auth.service'
import { AdminUserLoadingStatus } from '../../models/auth-user-loading-status'

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {

  constructor(private authService: AuthService) { }

  AdminUserLoadingStatus = AdminUserLoadingStatus
  adminSignUpStatus = this.authService.adminSignUpStatus

}