import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core'
import { MatSort, Sort } from '@angular/material/sort'
import { EMPTY, Observable, shareReplay, tap } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { Recipe } from '../../models/recipe.model'
import { PLATE_TYPE_TRANSLATE, RecipeConstants } from '../../models/recipe.constants'
import { RecipeActions as ItemActions } from '../../store/recipe.actions'
import { getItems, getPaginationResponse } from '../../store/recipe.selectors'
import { FormControl } from '@angular/forms'
import { PaginationRequest, PaginationResponse } from '../../../../shared/models/pagination.model'
import { SharedConstants } from '../../../../shared/utils/shared.constants'
import { SignalService } from '../../../../shared/services/signal.service'
import { combineListControls } from '../../utils/combine-list-controls'
import { SizeRequest } from '../../../../shared/repository/repository.model'

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeListComponent implements OnInit {
  // Selectors
  readonly dataList: Observable<Recipe[]> = this.store.select(getItems)
  // readonly downloadState: Observable<boolean> = this.store.select(getItemsLoadingState).pipe(shareReplay(1))
  readonly downloadState = EMPTY
  readonly paginationPayload: Observable<PaginationResponse<Recipe>> = this.store.select(getPaginationResponse)

  // Other properties
  readonly plateTypeTranslate = PLATE_TYPE_TRANSLATE
  @ViewChild(MatSort, { static: false }) sort: MatSort

  // Constants
  readonly defaultPaginationControlValue = RecipeConstants.defaultPaginationControlValue
  readonly defaultSizeControlValue = RecipeConstants.defaultSizeControlValue
  readonly tableColumns = RecipeConstants.tableColumns
  readonly moduleUrl = RecipeConstants.moduleUrl
  readonly defaultOrderControlValue = RecipeConstants.defaultOrderControlValue
  readonly tableLoadingOpacity = SharedConstants.tableLoadingOpacity
  readonly defaultRequestStatus = RecipeConstants.defaultRequestStatus
  readonly defaultTableSort = RecipeConstants.defaultTableSort
  readonly disableSort = RecipeConstants.disableSort

  // Controls
  paginationControl: FormControl<PaginationRequest<Recipe>> = new FormControl(this.defaultPaginationControlValue)
  sizeControl: FormControl<SizeRequest> = new FormControl(this.defaultSizeControlValue)
  orderControl: FormControl<Sort> = new FormControl(this.defaultOrderControlValue)

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private signalService: SignalService
  ) { }

  ngOnInit() {
    this.initData()
    this.setSignals()
  }

  initData() {
    combineListControls(this.paginationControl, this.sizeControl, this.orderControl, this.store)
      .pipe(
        tap(([pagination, size, order]) =>
          this.store.dispatch(
            ItemActions.getItems({
              request: {
                pagination: pagination,
                size: size,
                status: this.defaultRequestStatus,
                order: order,
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

  redirectToDetail(id: string) {
    this.router.navigate([`/${this.moduleUrl}` + `/${id}`])
  }
}
