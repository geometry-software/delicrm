import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core'
import { MatTabChangeEvent } from '@angular/material/tabs'
import { filter, tap } from 'rxjs'
import { Store } from '@ngrx/store'
import { UserActions } from '../../store/user.actions'
import { getListLabels, getItems, getLoadingStatus, getPaginationResponse, getStatus } from '../../store/user.selectors'
import { UserConstants } from '../../models/user.constants'
import { UserActions as ItemActions } from '../../store/user.actions'
import { MatDialog } from '@angular/material/dialog'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { UserStatusComponent } from '../user-status/users-status.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Sort } from '@angular/material/sort'
import { SortRequest } from '../../../../shared/repository/repository.models'
import { getStatusByLabel } from '../../../../shared/utils/get-status-by-label'
import { FormControl } from '@angular/forms'
import { combineListControls } from '../../../../shared/utils/combine-list-controls'
import { usersTabIndexByStatus } from '../../models/user.model'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {

  constructor(
    private store: Store,
    private destroyRef: DestroyRef,
    private dialog: MatDialog
  ) { }

  readonly LoadingStatus = LoadingStatus
  readonly defaultSortControlValue = UserConstants.defaultPageRequest.sort
  readonly tableColumns = UserConstants.tableColumns

  readonly orderList = this.store.select(getItems)
  readonly listLabels = this.store.select(getListLabels)
  readonly loadingStatus = this.store.select(getLoadingStatus)
  readonly paginationPayload = this.store.select(getPaginationResponse)
  readonly itemStatus = this.store.select(getStatus)

  readonly paginationControl = new FormControl(UserConstants.defaultPageRequest.pagination)
  readonly sizeControl = new FormControl(UserConstants.defaultPageRequest.size)
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
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(value => this.selectedTabIndex = usersTabIndexByStatus[value[3]])
      ).subscribe(([pagination, size, sort, status]) =>
        this.store.dispatch(ItemActions.getItems({ request: { pagination, size, sort, status } })))
  }

  openStatusForm(data) {
    this.dialog.open(UserStatusComponent, {
      width: 'auto',
      height: 'auto',
      autoFocus: false,
      data
    }).afterClosed().pipe(
      filter(Boolean),
      filter(status => status !== data.status),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(status => this.store.dispatch(UserActions.updateUserStatus({ status, id: data.id })))
  }

}