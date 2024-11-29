import { Component, ViewChild, OnInit, Signal, ChangeDetectorRef } from '@angular/core'
import { MatDrawer } from '@angular/material/sidenav'
import { concat, map, Observable, of, switchMap, tap } from 'rxjs'
import { userMenuOptions, getAuthMenuOptions } from '../../models/menu-options'
import { TranslateService } from '@ngx-translate/core'
import { MenuOption, ResponsiveLayout } from '../../models/navbar.model'
import { UserService } from '../../../domains/users/services/user.service'
import { SignalService } from '../../../shared/services/signal.service'
import { AuthService } from '../../../auth/services/auth.service'
import { AuthUser } from '../../../auth/models/auth.model'

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

  readonly toolBarTitleSignal: Signal<string> = this.signalService.getToolbarTitle

  authMenuOptions = concat(
    of(true),
    this.authService.fireAuthUser.pipe(
      map(value => !Boolean(value))))
    .pipe(
      map(value => value === true ? true : Boolean(value)),
      tap(v => console.log(v)),
      map(value => getAuthMenuOptions(value)),
      tap(v => console.log(v))
    )

  constructor(
    private authService: AuthService,
    private signalService: SignalService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initUserData()
    this.checkDelivery()
    this.checkClient()
    this.updateScreenSize()
    this.initTranslate()

    // this.authService.loginAnonymously()
  }

  initTranslate() {
    this.translate.addLangs(['es', 'pt', 'en'])
    this.translate.setDefaultLang('es')
    const lang = this.translate.getBrowserLang()
    this.translate.use(lang.match(/es|en/) ? lang : 'es')
  }

  initUserData(): void {
    // this.userService
    //   .getAppAuth()
    //   .pipe(
    //     tap((value) => {
    //       this.isAuthInitialized = true
    //       if (value.uid) {
    //         if (value.status === 'employee') {
    //           this.hasAppAuth = true
    //           this.user = value
    //           this.userMenuOptions = userMenuOptions
    //         } else if (value.status === 'client') {
    //           this.user = value
    //         }
    //       }
    //     })
    //   )
    //   .subscribe()
  }

  checkDelivery(): void { }

  checkClient(): void { }

  toggleDrawer() {
    if (!this.responsiveLayout.isDesktop) this.drawer.toggle()
  }

  onActivateRouter() {
    window.scroll(0, 0)
  }

  updateScreenSize() {
    const widthCheck = window.screen.width < 760
    const isMobile = !!typeof screen.orientation
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
