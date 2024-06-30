import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core'
import { MatSort, Sort } from '@angular/material/sort'
import { Observable, shareReplay, tap } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { Recipe } from '../../utils/recipe.model'
import { PLATE_TYPE_TRANSLATE, RecipeConstants } from '../../utils/recipe.constants'
import { RecipeActions as ItemActions } from '../../store/recipe.actions'
import { getItems, getItemsLoadingState, getPaginationResponse } from '../../store/recipe.selectors'
import { FormControl } from '@angular/forms'
import { PaginationRequest, PaginationResponse } from 'src/app/shared/model/pagination.model'
import { SizeRequest } from 'src/app/shared/repository/repository.model'
import { SharedConstants } from 'src/app/shared/utils/shared.constants'
import { combineListControls } from '../../utils/combine-list-controls'
import { SignalService } from 'src/app/shared/services/signal.service'

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeListComponent implements OnInit {
  // Selectors
  readonly dataList$: Observable<Recipe[]> = this.store$.select(getItems)
  readonly downloadState$: Observable<boolean> = this.store$.select(getItemsLoadingState).pipe(shareReplay(1))
  readonly paginationPayload$: Observable<PaginationResponse<Recipe>> = this.store$.select(getPaginationResponse)

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
    private store$: Store,
    private route: ActivatedRoute,
    private router: Router,
    private signalService: SignalService
  ) {}

  ngOnInit() {
    this.initData()
    this.setSignals()
  }

  initData() {
    combineListControls(this.paginationControl, this.sizeControl, this.orderControl, this.store$)
      .pipe(
        tap(([pagination, size, order]) =>
          this.store$.dispatch(
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
