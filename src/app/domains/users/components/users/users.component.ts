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
// import { getStatusByLabel } from '../../../../shared/utils/get-status-by-label'
import { FormControl } from '@angular/forms'
import { combineListControls } from '../../../../shared/utils/combine-list-controls'
import { User, UserRole, usersTabIndexByStatus, UserStatus } from '../../models/user.model'
import { Auth } from '../../../../auth/models/auth.model'

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

  readonly userList = this.store.select(getItems)
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
        status: UserConstants.statusList[event.index],
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
      filter(value => value.status !== data.status || value.role !== data.role),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => this.store.dispatch(UserActions.updateUserStatus({
      id: data.id,
      status: value.status,
      role: value.role,
      user: this.mapUser(data.status === 'requested', data, value.role, value.status)
    })))
  }

  mapUser(isNewUser: Boolean, auth: Auth, role: UserRole, status: UserStatus) {
    const user: User = {
      userId: auth.authId,
      avatar: auth.avatar,
      createdAt: auth.createdAt,
      email: auth.email,
      locale: auth.locale,
      name: auth.name,
      role,
      status
    }
    return isNewUser ? user : null
  }

}