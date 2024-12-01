import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { MatTabChangeEvent } from '@angular/material/tabs'
import { Observable, shareReplay, tap, filter } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppUser } from '../../utils/user.model'
import { AuthActions as ItemActions } from '../../store/user.actions'
import { getIsStatusUpdated, getItemsData, getItemsLoadingState, getListLabels } from '../../store/user.selectors'
import { UserConstants } from '../../utils/user.constants'
import { FormControl } from '@angular/forms'
import { Sort } from '@angular/material/sort'
import { combineListControls } from '../../utils/combine-list-controls'
import { MatDialog } from '@angular/material/dialog'
import { UserDetailComponent } from '../user-detail/user-detail.component'
import { SignalService } from '../../../../shared/services/signal.service'
import { PaginationRequest } from '../../../../shared/model/pagination.model'
import { SizeRequest } from '../../../../shared/repository/repository.model'
import { AuthStatus } from '../../../../auth/models/auth.model'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  // Selectors
  readonly userList: Observable<{
    data: Array<AppUser>
    status: AuthStatus
  }> = this.store.select(getItemsData).pipe(
    tap(() => (this.statusList = UserConstants.statusList)),
    tap((value) => (this.statusList = this.statusList.filter((el) => el !== value.status))),
    shareReplay(1)
  )
  readonly listLabels = this.store.select(getListLabels)
  readonly downloadState: Observable<boolean> = this.store.select(getItemsLoadingState)

  // Constants
  readonly defaultFirstPageRequest = UserConstants.defaultFirstPageRequest
  readonly defaultOrderControl = UserConstants.defaultOrderControlValue
  readonly tableColumns = UserConstants.tableColumns

  // Tab
  statusList = UserConstants.statusList
  updatedStatus: AuthStatus
  selectedTabIndex: number

  // Controls
  readonly paginationControl: FormControl<PaginationRequest<AppUser>> = new FormControl(this.defaultFirstPageRequest.pagination)
  readonly sizeControl: FormControl<SizeRequest> = new FormControl(this.defaultFirstPageRequest.size)
  readonly orderControl: FormControl<Sort> = new FormControl(this.defaultOrderControl)
  readonly statusControl: FormControl<AuthStatus> = new FormControl('requested')

  constructor(
    private store: Store,
    private signalService: SignalService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.initData()
    this.setSignals()
    this.store
      .select(getIsStatusUpdated)
      .pipe(
        filter(Boolean),
        tap(() => this.switchTabAfterUpdate())
      )
      .subscribe()
  }

  initData() {
    combineListControls(this.paginationControl, this.orderControl, this.statusControl, this.store)
      .pipe(
        tap(([pagination, order, status]) =>
          this.store.dispatch(
            ItemActions.getItems({
              request: {
                order,
                pagination,
                size: {
                  size: 10,
                },
                status: status,
              },
            })
          )
        )
      )
      .subscribe()
  }

  setSignals() {
    this.signalService.setToolbarTitle(this.route.snapshot.data['title'])
    this.signalService.setLayoutType(this.route.snapshot.data['type'])
  }

  update(status: string, item: AppUser) {
    this.updatedStatus = status as AuthStatus
    this.store.dispatch(ItemActions.updateUserStatus({ item, status: this.updatedStatus }))
  }

  changeUserList(event: MatTabChangeEvent) {
    let labelAmount = event.tab.textLabel.split('(').pop().slice(0, -1)
    const request = event.tab.textLabel.slice(0, -labelAmount.length - 3).toLowerCase() as unknown as AuthStatus
    this.statusControl.setValue(request)
  }

  switchTabAfterUpdate() {
    switch (this.updatedStatus) {
      case 'requested':
        this.selectedTabIndex = 0
        break
      // case 'client':
      //   this.selectedTabIndex = 1
      //   break
      // case 'employee':
      //   this.selectedTabIndex = 2
      //   break
      case 'blocked':
        this.selectedTabIndex = 3
        break
    }
  }

  openDetail(user) {
    const dialog = this.dialog.open(UserDetailComponent, {
      width: '300px',
      height: 'auto',
      data: user,
    })
    dialog.afterClosed().subscribe((value) => {
      console.log(value)
    })
  }
}
