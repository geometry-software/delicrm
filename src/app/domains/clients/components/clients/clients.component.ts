import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { MatTabChangeEvent } from '@angular/material/tabs'
import { Observable, shareReplay, tap, filter, of, map, combineLatest } from 'rxjs'
import { Store } from '@ngrx/store'
import { ClientActions } from '../../store/client.actions'
import { isStatusUpdated, getItemsData, getItemsLoadingStatus, getListLabels, getRequestStatus } from '../../store/client.selectors'
import { ClientConstants } from '../../utils/client.constants'
import { FormControl } from '@angular/forms'
import { Sort } from '@angular/material/sort'
import { combineListControls } from '../../utils/combine-list-controls'
import { MatDialog } from '@angular/material/dialog'
import { ClientDetailComponent } from '../client-detail/client-detail.component'
import { SignalService } from '../../../../shared/services/signal.service'
import { PaginationRequest } from '../../../../shared/models/pagination.model'
import { SizeRequest } from '../../../../shared/repository/repository.model'
import { AuthStatus } from '../../../../auth/models/auth.model'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { SharedConstants } from '../../../../shared/utils/shared.constants'
import { ClientStatusComponent } from '../client-status/client-status.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ClientStatus } from '../../models/client.model'

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent implements OnInit {

  constructor(
    private store: Store,
    private destroyRef: DestroyRef,
    private dialog: MatDialog
  ) { }

  readonly LoadingStatus = LoadingStatus
  readonly defaultFirstPageRequest = ClientConstants.defaultFirstPageRequest
  readonly defaultOrderControl = ClientConstants.defaultOrderControlValue
  readonly tableColumns = ClientConstants.tableColumns
  readonly userStatusFormComponentConfig = SharedConstants.formComponentConfig

  readonly userList = combineLatest([
    this.store.select(getItemsData),
    this.store.select(getRequestStatus)
  ]).pipe(
    tap(() => (this.statusList = ClientConstants.statusList)),
    tap(([, status]) => (this.statusList = this.statusList.filter((el) => el !== status))),
    shareReplay(1),
    map(([data,]) => data.data)
  )
  readonly listLabels = this.store.select(getListLabels)
  readonly loadingStatus = this.store.select(getItemsLoadingStatus)

  statusList = ClientConstants.statusList
  updatedStatus: ClientStatus
  selectedTabIndex: number

  ngOnInit() {
    this.onSwitchTabAfterUpdate()
  }

  // setSignals() {
  //   this.signalService.setToolbarTitle(this.route.snapshot.data['title'])
  //   this.signalService.setLayoutType(this.route.snapshot.data['type'])
  // }

  changeUserList(event: MatTabChangeEvent) {
    let labelAmount = event.tab.textLabel.split('(').pop().slice(0, -1)
    const status = event.tab.textLabel.slice(0, -labelAmount.length - 3).toLowerCase() as unknown as ClientStatus
    this.store.dispatch(ClientActions.getItems({
      request: {
        pagination: this.defaultFirstPageRequest.pagination,
        size: this.defaultFirstPageRequest.size,
        status,
        order: this.defaultFirstPageRequest.order
      }
    }))
  }

  onSwitchTabAfterUpdate() {
    this.store
      .select(isStatusUpdated)
      .pipe(
        filter(Boolean),
        tap(() => {
          switch (this.updatedStatus) {
            case 'active':
              this.selectedTabIndex = 0
              break
            case 'blocked':
              this.selectedTabIndex = 1
              break
          }
        }),
        takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }

  openUserDetail(id: string) {

  }

  openStatusForm(data) {
    this.dialog.open(ClientStatusComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data
    }).afterClosed().pipe(
      filter(Boolean),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(status => this.store.dispatch(ClientActions.updateClientStatus({ status, id: data.id })))
  }

}