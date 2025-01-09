import { Component, ViewChild, OnInit, Signal, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit } from '@angular/core'
import { MatDrawer } from '@angular/material/sidenav'
import { userMenuOptions, authMenuOptions } from '../../models/menu-options'
import { TranslateService } from '@ngx-translate/core'
import { ResponsiveLayout, UserLanguageItem } from '../../models/navbar.model'
import { UserService } from '../../../domains/users/services/user.service'
import { SignalService } from '../../../shared/services/signal.service'
import { UserLanguage } from '../../../domains/users/models/user.model'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { combineLatest, map, shareReplay, tap } from 'rxjs'
import { toObservable } from '@angular/core/rxjs-interop'
import { Chart, ChartItem } from 'chart.js/auto';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit, AfterViewInit {

  constructor(
    private userService: UserService,
    private signalService: SignalService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) { }

  readonly authMenuOptions = authMenuOptions
  readonly userMenuOptions = userMenuOptions
  readonly appUser = this.userService.appUser.pipe(
    tap(v => console.log(v))
  )

  @ViewChild('drawer') drawer: MatDrawer
  responsiveLayout: ResponsiveLayout = {}

  languageOptions: UserLanguageItem[] = [
    { value: 'en', viewValue: 'English' },
    { value: 'es', viewValue: 'Español' },
    { value: 'pt', viewValue: 'Português' }
  ]

  hasAppAuth: boolean
  hasNewDelivery: boolean
  isMobileShown: boolean

  readonly toolBarTitleSignal: Signal<string> = this.signalService.getToolbarTitle
  readonly isLoading = combineLatest([
    toObservable(this.signalService.getLoadingStatus).pipe(
      map(value => value === LoadingStatus.Loading ? true : false)),
    this.userService.isUserLoading
  ]).pipe(
    map(([signal, auth]) => signal || auth),
    shareReplay(1)
  )

  ngOnInit(): void {
    this.checkDelivery()
    this.checkClient()
    this.updateScreenSize()
    this.initTranslate()
  }

  ngAfterViewInit(): void {
    this.initCharts()
  }

  initCharts() {
    const data = [
      { year: 2010, count: 10 },
      { year: 2011, count: 20 },
      { year: 2012, count: 15 },
      { year: 2013, count: 25 },
      { year: 2014, count: 22 },
      { year: 2015, count: 30 },
      { year: 2016, count: 28 },
    ];

    new Chart(
      document.getElementById('pie-chart') as ChartItem,
      {
        type: 'pie',
        data: {
          labels: data.map(row => row.year),
          datasets: [
            {
              label: ' by year',
              data: data.map(row => row.count)
            }
          ]
        }
      }
    );
  }

  initTranslate() {
    this.translate.addLangs(['es', 'pt', 'en'])
    this.translate.setDefaultLang('es')
    const lang = this.translate.getBrowserLang()
    this.translate.use(lang.match(/es|en/) ? lang : 'es')
  }

  checkDelivery() { }

  checkClient() { }

  toggleDrawer() {
    if (!this.responsiveLayout.isDesktop) {
      this.drawer.toggle()
    }
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