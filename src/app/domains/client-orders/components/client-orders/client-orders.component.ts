import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { ClientOrdersActions as ItemActions } from '../../store/client-orders.actions'
// import { LoadingStatus } from '../../../../shared/models/loading-status'
import { FormControl } from '@angular/forms'
// import { ClientOrdersConstants } from '../../models/shift.constants'
import { getItems, getLoadingStatus, getPaginationResponse } from '../../store/client-orders.selectors'
import { MatTabChangeEvent } from '@angular/material/tabs'
// import { getStatusByLabel } from '../../../../shared/utils/get-status-by-label'
import { Sort } from '@angular/material/sort'
// import { SortRequest } from '../../../../shared/repository/repository.models'
// import { combineListControls } from '../../../../shared/utils/combine-list-controls'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ClientOrdersConstants } from '../../models/client-orders.constants'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { getDateFromUnix } from '../../../../shared/utils/format-unix-time'
import { SortRequest } from '../../../../shared/repository/repository.models'
import { combineListControls } from '../../../../shared/utils/combine-list-controls'
import { of } from 'rxjs'
import { DELIVERY_STATUS_TRANSLATE, DeliveryStatus } from '../../../delivery/models/delivery.model'
// import { LoadingStatus } from '../../../shared/models/loading-status'
// import { getDateFromUnix } from '../../../../shared/utils/format-unix-time'
// import { getCurrency } from '../../store/admin-store/admin.selectors'

@Component({
  selector: 'app-client-ordersk',
  templateUrl: './client-orders.component.html',
  styleUrls: ['./client-orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientOrdersComponent implements OnInit {

  constructor(
    private store: Store,
    private destroyRef: DestroyRef
  ) { }

  readonly LoadingStatus = LoadingStatus
  readonly defaultSortControlValue = ClientOrdersConstants.defaultPageRequest.sort
  readonly tableColumns = ClientOrdersConstants.tableColumns

  readonly getDateFromUnix = getDateFromUnix

  readonly orderList = this.store.select(getItems)
  readonly loadingStatus = this.store.select(getLoadingStatus)
  readonly paginationPayload = this.store.select(getPaginationResponse)
  readonly itemStatus = of('confirmed' as DeliveryStatus)
  readonly deliveryTanslate = DELIVERY_STATUS_TRANSLATE
  // readonly currency = this.store.select(getCurrency)

  // readonly paginationControl = new FormControl(ClientOrdersConstants.defaultPageRequest.pagination)
  // readonly sizeControl = new FormControl(ClientOrdersConstants.defaultPageRequest.size)
  // readonly sortControl = new FormControl(this.defaultSortControlValue)

  selectedTabIndex: number = 0

  ngOnInit() {
    this.loadData()
  }

  // changeTab(event: MatTabChangeEvent) {
  //   this.store.dispatch(ItemActions.getItems({
  //     request: {
  //       pagination: this.paginationControl.value,
  //       size: this.sizeControl.value,
  //       status: 'confirmed',
  //       sort: this.defaultSortControlValue
  //     }
  //   }))
  // }

  // changeSort(sort: Sort) {
  //   this.sortControl.setValue(sort as SortRequest)
  // }

  loadData() {
    this.store.dispatch(ItemActions.getItems())
  }

}