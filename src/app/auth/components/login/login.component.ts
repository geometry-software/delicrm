import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { AuthActions as ItemActions } from '../../store/auth.actions'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { tap } from 'rxjs/operators'
import { ActivatedRoute } from '@angular/router'
import { AuthProvider } from '../../utils/auth.model'
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  hasFirebasAuth: boolean
  userDisplayName: string
  authUser: any

  constructor(
    private store$: Store,
    private angularFireAuth: AngularFireAuth,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initFirebaseAuth()
  }

  initFirebaseAuth() {
    this.angularFireAuth.authState
      .pipe(
        tap((value) => {
          this.hasFirebasAuth = true
          if (value) {
            this.userDisplayName = value.displayName
          }

          this.cdr.markForCheck()
        })
      )
      .subscribe()
  }

  login(provider: AuthProvider) {
    switch (provider) {
      case 'google':
        this.store$.dispatch(ItemActions.loginWithGoogle())
        break
    }
  }
}
