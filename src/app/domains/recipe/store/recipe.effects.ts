import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects'
import { catchError, EMPTY, map, of, switchMap, tap, withLatestFrom } from 'rxjs'
import { RecipeActions as ItemActions } from './recipe.actions'
import { RecipeEntityService } from '../services/recipe.service'
import { Router } from '@angular/router'
import { RecipeConstants } from '../models/recipe.constants'
import { Action, Store } from '@ngrx/store'
import { ConfirmationService } from '../../../shared/services/confirmation.service'
import { SignalService } from '../../../shared/services/signal.service'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { recipeFormGroup } from '../models/recipe.form'
import { getCurrent, getSize, getTotal } from './recipe.selectors'
import { formatRequest } from '../../../shared/utils/format-request'
import { formatResponseList } from '../../../shared/repository/repository.utils'

@Injectable()
export class RecipeEffects implements OnInitEffects {

  constructor(
    private router: Router,
    private actions: Actions,
    private store: Store,
    private entityService: RecipeEntityService,
    private confirmationService: ConfirmationService,
    private signalService: SignalService
  ) { }

  readonly moduleUrl = RecipeConstants.moduleUrl
  readonly deleteTitle = RecipeConstants.deleteTitle
  readonly defaultCreateStatus = RecipeConstants.defaultCreateStatus
  readonly defaultFirstPageRequest = RecipeConstants.defaultPageRequest
  readonly form = recipeFormGroup

  createItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createItem),
      tap(() => this.signalService.setLoadingStatus(LoadingStatus.Loading)),
      switchMap(({ item }) =>
        this.entityService.create(item).pipe(
          tap((id) => {
            this.signalService.setLoadingStatus(LoadingStatus.Loaded)
            this.router.navigate([this.moduleUrl, id])
            this.form.reset()
          }),
          map(() => ItemActions.getItems({ request: this.defaultFirstPageRequest })),
          catchError(error => this.handleError(error, 'create')))))
  )

  updateItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateItem),
      switchMap(({ item, id }) =>
        this.entityService.update(item, id).pipe(
          tap((id) => this.router.navigate([this.moduleUrl, id])),
          map(() => ItemActions.updateItemSuccess()),
          catchError(error => this.handleError(error, 'edit')))))
  )

  deleteItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.deleteItem),
      switchMap(({ id }) =>
        this.confirmationService.defaultConfirm(this.deleteTitle).pipe(
          switchMap(() =>
            this.entityService.delete(id).pipe(
              tap(() => this.router.navigate([this.moduleUrl])),
              catchError(error => this.handleError(error, 'edit'))))))),
    { dispatch: false }
  )

  getItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItem),
      switchMap(({ id }) =>
        this.entityService.getById(id).pipe(
          tap(console.warn),
          map(item => ItemActions.getItemSuccess({ item })),
          catchError(error => this.handleError(error, 'edit')))))
  )

  getItems = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItems),
      tap(() => this.handleLoadingRequest()),
      withLatestFrom(
        this.store.select(getCurrent),
        this.store.select(getTotal),
        this.store.select(getSize)
      ),
      switchMap(([{ request }, current, total, stateSize]) => {
        const { query, size, item, sort, status } = formatRequest(request, stateSize)
        console.log(formatRequest(request, stateSize));

        switch (query) {
          case 'first':
            return this.entityService
              .getFirstPage(sort, size, status)
              .pipe(
                tap(() => this.handleLoadedRequest()),
                map(items => ItemActions.getItemsSuccess({ items: formatResponseList(query, items, total, current) })),
                catchError(error => this.handleError(error, 'all')))
          case 'next':
            return this.entityService
              .getNextPage(sort, size, status, item[sort.active])
              .pipe(
                tap(() => this.handleLoadedRequest()),
                map(items => ItemActions.getItemsSuccess({ items: formatResponseList(query, items, total, current) })),
                catchError(error => this.handleError(error, 'all')))
          case 'previous':
            return this.entityService
              .getPreviousPage(sort, size, status, item[sort.active])
              .pipe(
                tap(() => this.handleLoadedRequest()),
                map(items => ItemActions.getItemsSuccess({ items: formatResponseList(query, items, total, current) })),
                catchError(error => this.handleError(error, 'all')))
          default: return EMPTY
        }
      })
    )
  )

  getItemsBySearchQuery = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItemsBySearchQuery),
      switchMap(({ request }) =>
        this.entityService.getAllByQuery(request.key, request.value).pipe(
          map(items => ItemActions.getItemsSuccess({ items: formatResponseList('custom', items, items.length, items.length) })),
          catchError(error => of(ItemActions.notifyError({ error, query: 'custom' })))
        )
      )
    )
  )

  getItemsSuccess = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItemsSuccess),
      tap(() => this.signalService.setLoadingStatus(LoadingStatus.Loaded))),
    { dispatch: false }
  )

  notifyError = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.notifyError),
      tap(({ error }) => console.error(error))
      // switchMap(() => of(this.notificationService.notifyError()))
    ),
    { dispatch: false }
  )

  private handleError(error, query) {
    this.signalService.setLoadingStatus(LoadingStatus.LoadingFailed)
    return of(ItemActions.notifyError({ error, query }))
  }

  private handleLoadingRequest() {
    this.signalService.setLoadingStatus(LoadingStatus.Loading)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loading }))
  }

  private handleLoadedRequest() {
    this.signalService.setLoadingStatus(LoadingStatus.Loaded)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loaded }))
  }

  ngrxOnInitEffects(): Action {
    return ItemActions.getItems({ request: this.defaultFirstPageRequest });
  }
}
