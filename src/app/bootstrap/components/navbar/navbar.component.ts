import { Component, ViewChild, OnInit, Signal, ChangeDetectorRef } from '@angular/core'
import { MatDrawer } from '@angular/material/sidenav'
import { Observable, tap } from 'rxjs'
import { userMenuOptions, clientMenuOptions } from '../../utils/menu-options'
import { TranslateService } from '@ngx-translate/core'
import { SignalService } from 'src/app/shared/services/signal.service'
import { MenuOption, ResponsiveLayout } from '../../utils/navbar.model'
import { AuthUser } from 'src/app/auth/utils/auth.model'
import { AuthService } from '../../../auth/services/auth.service'
import { isMobileScreen } from '../../utils/screen-orientation'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer
  responsiveLayout: ResponsiveLayout = {}

  isAuthInitialized: boolean
  hasAppAuth: boolean
  user: AuthUser

  hasNewDelivery: boolean
  userMenuOptions: Array<MenuOption> = userMenuOptions

  isMobileShown: boolean

  readonly clientMenuOptions = clientMenuOptions
  readonly toolBarTitleSignal: Signal<string> = this.signalService.getToolbarTitle
  readonly appAuth$: Observable<AuthUser>

  constructor(
    private authService: AuthService,
    private signalService: SignalService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initUserData()
    this.checkDelivery()
    this.checkClient()
    this.updateScreenSize()
    this.initTranslate()
  }

  initTranslate() {
    this.translate.addLangs(['es', 'pt', 'en'])
    this.translate.setDefaultLang('es')
    const lang = this.translate.getBrowserLang()
    this.translate.use(lang.match(/es|en/) ? lang : 'es')
  }

  initUserData(): void {
    this.authService
      .getAppAuth()
      .pipe(
        tap((value) => {
          this.isAuthInitialized = true
          if (value.uid) {
            if (value.status === 'employee') {
              this.hasAppAuth = true
              this.user = value
              this.userMenuOptions = userMenuOptions
            } else if (value.status === 'client') {
              this.user = value
            }
          }
        })
      )
      .subscribe()
  }

  checkDelivery(): void {}

  checkClient(): void {}

  toggleDrawer() {
    if (!this.responsiveLayout.isDesktop) this.drawer.toggle()
  }

  onActivateRouter() {
    window.scroll(0, 0)
  }

  updateScreenSize() {
    const widthCheck = window.screen.width < 760
    const isMobile = isMobileScreen
    if (!widthCheck) {
      this.responsiveLayout.isDesktop = true
      this.responsiveLayout.matDrawerMode = 'side'
      this.responsiveLayout.matToolbarRowButtonMargin = '15px'
      this.responsiveLayout.menuListContainerMargin = '0'
    } else {
      this.responsiveLayout.isDesktop = false
      this.responsiveLayout.matDrawerMode = 'over'
      this.responsiveLayout.matToolbarRowButtonMargin = '0px'
      this.responsiveLayout.menuListContainerMargin = '10px'
    }
  }

  changeLanguage(lang) {
    this.translate.use(lang)
    this.cdr.markForCheck()
  }

  toggleMobile() {
    this.isMobileShown = !this.isMobileShown
  }
}
