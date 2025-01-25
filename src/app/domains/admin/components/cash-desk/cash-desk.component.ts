import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { ShiftActions as ItemActions } from '../../store/shift-store/shift.actions'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { FormControl } from '@angular/forms'
import { ShiftConstants } from '../../models/shift.constants'
import { getItems, getLoadingStatus, getPaginationResponse, getStatus } from '../../store/shift-store/shift.selectors'
import { MatTabChangeEvent } from '@angular/material/tabs'
// import { getStatusByLabel } from '../../../../shared/utils/get-status-by-label'
import { Sort } from '@angular/material/sort'
import { SortRequest } from '../../../../shared/repository/repository.models'
import { combineListControls } from '../../../../shared/utils/combine-list-controls'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { getDateFromUnix } from '../../../../shared/utils/format-unix-time'
import { getCurrency } from '../../store/admin-store/admin.selectors'

@Component({
  selector: 'app-cash-desk',
  templateUrl: './cash-desk.component.html',
  styleUrls: ['./cash-desk.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashDeskComponent implements OnInit {

  constructor(
    private store: Store,
    private destroyRef: DestroyRef
  ) { }

  readonly LoadingStatus = LoadingStatus
  readonly defaultSortControlValue = ShiftConstants.defaultPageRequest.sort
  readonly tableColumns = ShiftConstants.tableColumns

  readonly getDateFromUnix = getDateFromUnix

  readonly shiftList = this.store.select(getItems)
  readonly loadingStatus = this.store.select(getLoadingStatus)
  readonly paginationPayload = this.store.select(getPaginationResponse)
  readonly itemStatus = this.store.select(getStatus)
  readonly currency = this.store.select(getCurrency)

  readonly paginationControl = new FormControl(ShiftConstants.defaultPageRequest.pagination)
  readonly sizeControl = new FormControl(ShiftConstants.defaultPageRequest.size)
  readonly sortControl = new FormControl(this.defaultSortControlValue)

  selectedTabIndex: number = 0

  ngOnInit() {
    this.loadData()
  }

  changeTab(event: MatTabChangeEvent) {
    this.store.dispatch(ItemActions.getItems({
      request: {
        pagination: this.paginationControl.value,
        size: this.sizeControl.value,
        status: ShiftConstants.statusList[event.index],
        sort: this.defaultSortControlValue
      }
    }))
  }

  changeSort(sort: Sort) {
    this.sortControl.setValue(sort as SortRequest)
  }

  loadData() {
    combineListControls(this.paginationControl, this.sizeControl, this.sortControl, this.itemStatus)
      .pipe(takeUntilDestroyed(this.destroyRef)
      ).subscribe(([pagination, size, sort, status]) =>
        this.store.dispatch(ItemActions.getItems({ request: { pagination, size, sort, status } })))
  }

}