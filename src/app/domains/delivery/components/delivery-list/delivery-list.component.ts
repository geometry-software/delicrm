import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core'
import { DeliveryActions as ItemActions } from '../../store/delivery.actions'
import { DeliveryConstants } from '../../models/delivery.constants'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { Store } from '@ngrx/store'
import { getItems, getListLabels, getLoadingStatus, getPaginationResponse, getStatus } from '../../store/delivery.selectors'
import { MatTabChangeEvent } from '@angular/material/tabs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl } from '@angular/forms'
import { getStatusByLabel } from '../../../../shared/utils/get-status-by-label'
import { combineListControls } from '../../../../shared/utils/combine-list-controls'
import { Sort } from '@angular/material/sort'
import { SortRequest } from '../../../../shared/repository/repository.models'
import { Delivery } from '../../models/delivery.model'


@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryListComponent {

  constructor(
    private store: Store,
    private destroyRef: DestroyRef
  ) { }

  readonly LoadingStatus = LoadingStatus
  readonly defaultSortControlValue = DeliveryConstants.defaultPageRequest.sort
  readonly tableColumns = DeliveryConstants.tableColumns

  readonly orderList = this.store.select(getItems)
  readonly listLabels = this.store.select(getListLabels)
  readonly loadingStatus = this.store.select(getLoadingStatus)
  readonly paginationPayload = this.store.select(getPaginationResponse)
  readonly itemStatus = this.store.select(getStatus)

  readonly paginationControl = new FormControl(DeliveryConstants.defaultPageRequest.pagination)
  readonly sizeControl = new FormControl(DeliveryConstants.defaultPageRequest.size)
  readonly sortControl = new FormControl(this.defaultSortControlValue)

  selectedTabIndex: number

  ngOnInit() {
    this.loadData()
  }

  changeTab(event: MatTabChangeEvent) {
    this.store.dispatch(ItemActions.getItems({
      request: {
        pagination: this.paginationControl.value,
        size: this.sizeControl.value,
        status: getStatusByLabel(event),
        sort: this.defaultSortControlValue
      }
    }))
  }

  changeSort(sort: Sort) {
    this.sortControl.setValue(sort as SortRequest)
  }

  loadData() {
    combineListControls(this.paginationControl, this.sizeControl, this.sortControl, this.itemStatus)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([pagination, size, sort, status]) =>
        this.store.dispatch(ItemActions.getItems({ request: { pagination, size, sort, status } })))
  }

  showDetail(delivery: Delivery) {
    console.log(delivery);
  }

}