import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core'
import { OrderActions as ItemActions } from '../../store/order.actions'
import { OrderConstants } from '../../models/order.constants'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { Store } from '@ngrx/store'
import { tap } from 'rxjs'
import { Sort } from '@angular/material/sort'
import { getItems, getListLabels, getItemsLoadingStatus, getPaginationResponse, getStatus } from '../../store/order.selectors'
import { MatTabChangeEvent } from '@angular/material/tabs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl } from '@angular/forms'
import { combineListControls } from '../../../../shared/utils/combine-list-controls'
import { SortRequest } from '../../../../shared/repository/repository.models'
import { ordersTabIndexByStatus } from '../../models/order.model'

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class OrderListComponent implements OnInit {

  constructor(
    private store: Store,
    private destroyRef: DestroyRef
  ) { }

  readonly LoadingStatus = LoadingStatus
  readonly defaultSortControlValue = OrderConstants.defaultPageRequest.sort
  readonly tableColumns = OrderConstants.tableColumns

  readonly orderList = this.store.select(getItems)
  readonly listLabels = this.store.select(getListLabels)
  readonly loadingStatus = this.store.select(getItemsLoadingStatus)
  readonly paginationPayload = this.store.select(getPaginationResponse)
  readonly itemStatus = this.store.select(getStatus)

  readonly paginationControl = new FormControl(OrderConstants.defaultPageRequest.pagination)
  readonly sizeControl = new FormControl(OrderConstants.defaultPageRequest.size)
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
        status: OrderConstants.statusList[event.index],
        sort: this.defaultSortControlValue
      }
    }))
  }

  changeSort(sort: Sort) {
    this.sortControl.setValue(sort as SortRequest)
  }

  loadData() {
    combineListControls(this.paginationControl, this.sizeControl, this.sortControl, this.itemStatus)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(value => this.selectedTabIndex = ordersTabIndexByStatus[value[3]])
      ).subscribe(([pagination, size, sort, status]) =>
        this.store.dispatch(ItemActions.getItems({ request: { pagination, size, sort, status } })))
  }

}