import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ElementRef, OnInit, ViewChild } from '@angular/core'
import { saveAs } from 'file-saver'
import * as moment from 'moment'
import { combineLatest, filter, map, tap } from 'rxjs'
import domtoimage from 'dom-to-image'
import { Store } from '@ngrx/store'
import { getCurrency, getMenu, getRestaurantInfo, isRestaurantOpen, loadingStatus, printMenu } from '../../store/board-store/board.selectors'
import { BoardActions as ItemActions } from '../../store/board-store/board.actions'
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
    private destroyRef: DestroyRef,
    private cdr: ChangeDetectorRef,
  ) { }

  @ViewChild('print') print: ElementRef;

  readonly today = moment(new Date()).locale(BootstrapConstants.locale).format('dddd DD MMMM')
  readonly imageData = combineLatest([
    this.store.select(getMenu),
    this.store.select(getCurrency),
    this.store.select(getRestaurantInfo).pipe(filter(Boolean)),
    this.store.select(isRestaurantOpen),
  ]).pipe(
    map(value => ({
      menu: value[0],
      currency: value[1],
      restaurant: value[2],
      open: value[3],
    })))
  readonly commonImg = 'assets/dish.png'
  readonly web = BootstrapConstants.web

  ngOnInit() {
    this.onPrintDailyMenu()
  }

  onPrintDailyMenu() {
    this.store.select(printMenu).pipe(
      filter(Boolean),
      tap(() => domtoimage.toBlob(this.print.nativeElement).then(blob => {
        const name = 'Menu ' + this.today
        saveAs(blob, name)
        this.store.dispatch(ItemActions.printMenuSuccess())
      })),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
  }

}