import { Component, ViewChild, OnInit, Signal, ChangeDetectorRef } from '@angular/core'
import { MatDrawer } from '@angular/material/sidenav'
import { userMenuOptions, authMenuOptions } from '../../models/menu-options'
import { TranslateService } from '@ngx-translate/core'
import { ResponsiveLayout } from '../../models/navbar.model'
import { UserService } from '../../../domains/users/services/user.service'
import { SignalService } from '../../../shared/services/signal.service'
import { UserLanguage } from '../../../domains/users/utils/user.model'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { of } from 'rxjs'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  constructor(
    private userService: UserService,
    private signalService: SignalService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) { }

  readonly authMenuOptions = authMenuOptions
  readonly userMenuOptions = userMenuOptions
  readonly appUser = this.userService.appUser
  readonly isUserLoading = this.userService.isUserLoading
  readonly LoadingStatus = LoadingStatus

  loadingStatus = of(LoadingStatus.NotLoaded)

  @ViewChild('drawer') drawer: MatDrawer
  responsiveLayout: ResponsiveLayout = {}

  hasAppAuth: boolean
  hasNewDelivery: boolean
  isMobileShown: boolean

  readonly toolBarTitleSignal: Signal<string> = this.signalService.getToolbarTitle

  ngOnInit(): void {
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

  changeLanguage(lang: UserLanguage) {
    this.translate.use(lang)
    this.cdr.markForCheck()
  }

  toggleMobile() {
    this.isMobileShown = !this.isMobileShown
  }
}
