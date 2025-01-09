import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core'
import { saveAs } from 'file-saver'
import * as moment from 'moment'
import { filter, map, tap } from 'rxjs'
import domtoimage from 'dom-to-image'
import { Store } from '@ngrx/store'
import { getCurrency, getMenu, getRestaurantInfo, loadingStatus, printMenu } from '../../store/admin-store/admin.selectors'
import { AdminActions as ItemActions } from '../../store/admin-store/admin.actions'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { fadeInOnEnterAnimation } from 'angular-animations'

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

  readonly commonImg = 'assets/dish.png'
  readonly today = moment(new Date()).locale('es').format('dddd DD MMMM')
  readonly dailyMenu = this.store.select(getMenu)
  readonly currency = this.store.select(getCurrency)
  readonly restaurantInfo = this.store.select(getRestaurantInfo)
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