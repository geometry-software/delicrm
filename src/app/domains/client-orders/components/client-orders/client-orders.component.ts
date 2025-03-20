import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { ClientOrdersActions as ItemActions } from '../../store/client-orders.actions'
import { getItems, getLoadingStatus, getPaginationResponse } from '../../store/client-orders.selectors'
import { ClientOrdersConstants } from '../../models/client-orders.constants'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { getDateFromUnix } from '../../../../shared/utils/format-unix-time'
import { of } from 'rxjs'
import { DELIVERY_STATUS_TRANSLATE, DeliveryStatus } from '../../../delivery/models/delivery.model'

@Component({
  selector: 'app-client-ordersk',
  templateUrl: './client-orders.component.html',
  styleUrls: ['./client-orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientOrdersComponent implements OnInit {

  constructor(
    private store: Store
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

  selectedTabIndex: number = 0

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.store.dispatch(ItemActions.getItems())
  }

}