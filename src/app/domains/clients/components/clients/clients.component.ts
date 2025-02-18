import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core'
import { MatTabChangeEvent } from '@angular/material/tabs'
import { tap, filter } from 'rxjs'
import { Store } from '@ngrx/store'
import { ClientActions } from '../../store/client.actions'
import { getListLabels, getItems, getLoadingStatus, getPaginationResponse, getStatus } from '../../store/client.selectors'
import { ClientConstants } from '../../models/client.constants'
import { FormControl } from '@angular/forms'
import { Sort } from '@angular/material/sort'
import { ClientActions as ItemActions } from '../../store/client.actions'
import { MatDialog } from '@angular/material/dialog'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { ClientStatusComponent } from '../client-status/client-status.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
// import { getStatusByLabel } from '../../../../shared/utils/get-status-by-label'
import { SortRequest } from '../../../../shared/repository/repository.models'
import { combineListControls } from '../../../../shared/utils/combine-list-controls'
import { clientsTabIndexByStatus } from '../../models/client.model'
import { Auth } from '../../../../auth/models/auth.model'
import { ClientFormComponent } from '../client-form/client-form.component'
import { SignalService } from '../../../../shared/services/signal.service'

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ClientFormComponent]
})
export class ClientsComponent implements OnInit {

  constructor(
    private store: Store,
    private destroyRef: DestroyRef,
    private signalService: SignalService,
    private dialog: MatDialog
  ) { }

  readonly LoadingStatus = LoadingStatus
  readonly defaultSortControlValue = ClientConstants.defaultPageRequest.sort
  readonly tableColumns = ClientConstants.tableColumns

  readonly orderList = this.store.select(getItems)
  readonly listLabels = this.store.select(getListLabels)
  readonly loadingStatus = this.store.select(getLoadingStatus)
  readonly paginationPayload = this.store.select(getPaginationResponse)
  readonly itemStatus = this.store.select(getStatus)

  readonly paginationControl = new FormControl(ClientConstants.defaultPageRequest.pagination)
  readonly sizeControl = new FormControl(ClientConstants.defaultPageRequest.size)
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
        status: ClientConstants.statusList[event.index],
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
        tap(value => this.selectedTabIndex = clientsTabIndexByStatus[value[3]])
      ).subscribe(([pagination, size, sort, status]) =>
        this.store.dispatch(ItemActions.getItems({ request: { pagination, size, sort, status } })))
  }

  updateStatus(data) {
    this.dialog.open(ClientStatusComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data
    }).afterClosed().pipe(
      filter(Boolean),
      filter(status => status !== data.status),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(status => this.store.dispatch(ClientActions.updateClientStatus({ status, id: data.id })))
  }

  openForm(data: Auth) {
    this.signalService.setClientLoadingStatus(LoadingStatus.NotLoaded)
    this.dialog.open(ClientFormComponent, {
      width: 'auto',
      height: '90%',
      autoFocus: false,
      data
    }).backdropClick().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.store.dispatch(ClientActions.resetClientForm()))
  }

}