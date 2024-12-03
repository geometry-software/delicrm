import { ChangeDetectionStrategy, Component } from '@angular/core'
import { AuthService } from '../../services/auth.service'
import { AdminSignUpLoadingStatus } from '../../models/loading-status'

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {

  constructor(private authService: AuthService) { }

  AdminUserLoadingStatus = AdminSignUpLoadingStatus
  adminSignUpStatus = this.authService.adminSignUpStatus

}