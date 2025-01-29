import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewChild } from '@angular/core'
import { MatSort, Sort } from '@angular/material/sort'
import { of, tap } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { PLATE_TYPE_TRANSLATE, RecipeConstants } from '../../models/recipe.constants'
import { RecipeActions as ItemActions } from '../../store/recipe.actions'
import { getItems, getLoadingStatus, getPaginationResponse, getQuery, getSize } from '../../store/recipe.selectors'
import { FormControl } from '@angular/forms'
import { SharedConstants } from '../../../../shared/utils/shared.constants'
import { SignalService } from '../../../../shared/services/signal.service'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { combineListControls } from '../../../../shared/utils/combine-list-controls'
import { OrderConstants } from '../../../orders/models/order.constants'
import { RepositoryEntityStatus, SortRequest } from '../../../../shared/repository/repository.models'

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeListComponent implements OnInit {

  constructor(
    private store: Store,
    private router: Router,
    private signalService: SignalService,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef
  ) { }

  readonly LoadingStatus = LoadingStatus
  readonly loadingStatus = this.store.select(getLoadingStatus)
  readonly dataList = this.store.select(getItems)
  readonly query = this.store.select(getQuery)
  readonly customQuerySize = this.store.select(getSize)
  readonly downloadState = this.store.select(getLoadingStatus)
  readonly paginationPayload = this.store.select(getPaginationResponse)

  readonly plateTypeTranslate = PLATE_TYPE_TRANSLATE
  @ViewChild(MatSort, { static: false }) sort: MatSort

  // Constants
  readonly tableColumns = RecipeConstants.tableColumns
  readonly moduleUrl = RecipeConstants.moduleUrl
  readonly tableLoadingOpacity = SharedConstants.tableLoadingOpacity
  readonly defaultRequestStatus = RecipeConstants.defaultRequestStatus
  readonly defaultTableSort = RecipeConstants.defaultTableSort
  readonly disableSort = RecipeConstants.disableSort
  readonly defaultSortControlValue = OrderConstants.defaultPageRequest.sort

  readonly paginationControl = new FormControl(OrderConstants.defaultPageRequest.pagination)
  readonly sizeControl = new FormControl(OrderConstants.defaultPageRequest.size)
  readonly sortControl = new FormControl(this.defaultSortControlValue)

  ngOnInit() {
    this.initData()
    this.signalService.setLayoutType(this.route.snapshot.data['type'])
  }

  changeSort(sort: Sort) {
    this.sortControl.setValue(sort as SortRequest)
  }

  initData() {
    combineListControls(this.paginationControl, this.sizeControl, this.sortControl, of(this.defaultRequestStatus))
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(([pagination, size, sort, status]) =>
        this.store.dispatch(ItemActions.getItems({ request: { pagination, size, sort, status: status as RepositoryEntityStatus } })))
  }

  redirectToDetail(id: string) {
    this.router.navigate([`/${this.moduleUrl}` + `/${id}`])
  }

}