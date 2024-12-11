import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core'
import { saveAs } from 'file-saver'
import * as moment from 'moment'
import { Observable, catchError, filter, shareReplay, tap } from 'rxjs'
import domtoimage from 'dom-to-image'
import { Store } from '@ngrx/store'
import { printMenu } from '../../store/admin.selectors'
import { AdminActions as ItemActions } from '../../store/admin.actions'
import { RestaurantService } from '../../services/restaurant.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { DailyMenu } from '../../models/restaurant'
import { SignalService } from '../../../../shared/services/signal.service'
import { LoadingStatus } from '../../../../shared/models/loading-status'

@Component({
  selector: 'app-image-menu',
  templateUrl: './image-menu.component.html',
  styleUrls: ['./image-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageMenuComponent implements OnInit {

  menuTitle = 'Deli CRM'
  dailyMenu: Observable<DailyMenu>

  readonly commonImg = 'assets/dish.png'
  readonly today = moment(new Date()).locale('es').format('dddd DD MMMM')
  readonly domtoimage = domtoimage

  constructor(
    private restaurantService: RestaurantService,
    private store: Store,
    private signalService: SignalService,
    private destroyRef: DestroyRef
  ) { }

  ngOnInit() {
    this.initDailyMenu()
    this.onPrintDailyMenu()
  }

  initDailyMenu() {
    this.signalService.setLoadingStatus(LoadingStatus.Loading)
    this.dailyMenu = this.restaurantService.getDailyMenu().pipe(
      tap(() => this.signalService.setLoadingStatus(LoadingStatus.Loaded)),
      catchError(() => {
        this.signalService.setLoadingStatus(LoadingStatus.Loaded)
        return []
      }),
      shareReplay(1)
    )
  }

  onPrintDailyMenu() {
    this.store.select(printMenu).pipe(
      filter(Boolean),
      tap(() => {
        this.domtoimage.toBlob(document.getElementById('print')).then(blob => {
          const name = 'Menu ' + this.today
          saveAs(blob, name)
          // this.signalService.setLoadingStatus(LoadingStatus.LoadingSuccess)
          // this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.LoadingSuccess }))
          this.store.dispatch(ItemActions.printMenuSuccess())
        })
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
  }

}