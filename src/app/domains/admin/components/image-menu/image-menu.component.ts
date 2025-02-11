import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core'
import { saveAs } from 'file-saver'
import * as moment from 'moment'
import { combineLatest, filter, map, tap } from 'rxjs'
import domtoimage from 'dom-to-image'
import { Store } from '@ngrx/store'
import { getCurrency, getMenu, getRestaurantInfo, getRestaurantLocale, isRestaurantOpen, loadingStatus, printMenu } from '../../store/admin-store/admin.selectors'
import { AdminActions as ItemActions } from '../../store/admin-store/admin.actions'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { fadeInOnEnterAnimation } from 'angular-animations'
import { RestaurantService } from '../../services/restaurant.service'
import { BootstrapConstants } from '../../../../bootstrap/models/bootstrap.constants'
import { isNil } from 'lodash'

@Component({
  selector: 'app-image-menu',
  templateUrl: './image-menu.component.html',
  styleUrls: ['./image-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOnEnterAnimation()]
})
export class ImageMenuComponent implements OnInit {

  constructor(
    private store: Store,
    private destroyRef: DestroyRef
  ) { }

  private readonly today = this.store.select(getRestaurantLocale).pipe(
    map(value => moment(new Date()).locale(value ?? BootstrapConstants.locale).format('dddd DD MMMM')))

  readonly imageData = combineLatest([
    this.today,
    this.store.select(getMenu),
    this.store.select(getCurrency),
    this.store.select(getRestaurantInfo),
    this.store.select(isRestaurantOpen),
  ]).pipe(
    map(value => ({
      today: value[0],
      menu: value[1],
      currency: value[2],
      restaurant: value[3],
      open: value[4],
    }))
  )
  readonly commonImg = 'assets/dish.png'
  readonly isLoaded = this.store.select(loadingStatus).pipe(
    map(loading => loading === LoadingStatus.Loaded))

  ngOnInit() {
    this.onPrintDailyMenu()
  }

  onPrintDailyMenu() {
    this.store.select(printMenu).pipe(
      filter(Boolean),
      tap(() => {
        domtoimage.toBlob(document.getElementById('print')).then(blob => {
          const name = 'Menu ' + this.today
          saveAs(blob, name)
          this.store.dispatch(ItemActions.printMenuSuccess())
        })
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
  }

}