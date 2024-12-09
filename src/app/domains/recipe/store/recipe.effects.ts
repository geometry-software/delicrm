import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects'
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs'
import { RecipeActions as ItemActions } from './recipe.actions'
import { RecipeEntityService } from '../services/recipe.service'
import { Router } from '@angular/router'
import { RecipeConstants } from '../models/recipe.constants'
import { formatRequest } from '../../../shared/utils/format-request'
import { Action, Store } from '@ngrx/store'
import { getItemsPageAmount, getResetRequestToTheFirstPage } from './recipe.selectors'
import { ConfirmationService } from '../../../shared/services/confirmation.service'
import { SignalService } from '../../../shared/services/signal.service'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { recipeFormGroup } from '../models/recipe.form'

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
  readonly defaultFirstPageRequest = RecipeConstants.defaultFirstPageRequest
  readonly form = recipeFormGroup

  createItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createItem),
      tap(() => this.signalService.setLoadingStatus(LoadingStatus.Loading)),
      switchMap(({ item }) =>
        this.entityService.create(item).pipe(
          tap((id) => {
            this.signalService.setLoadingStatus(LoadingStatus.LoadingSuccess)
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

  getItems = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItems),
      tap(() => this.signalService.setLoadingStatus(LoadingStatus.Loading)),
      withLatestFrom(this.store.select(getResetRequestToTheFirstPage), this.store.select(getItemsPageAmount)),
      switchMap(([{ request }, resetRequest, pageAmount]) => {
        const { size, item, query, order, status } = formatRequest(request, resetRequest)
        switch (query) {
          case 'all':
            return this.entityService.getAll().pipe(
              switchMap((items) =>
                this.entityService
                  .getTotalByStatus(status)
                  .pipe(map((total) => ItemActions.getItemsSuccess({ items, query: 'all', total })))
              ),
              catchError(error => of(ItemActions.notifyError({ error, errorType: 'list' })))
            )
          case 'first':
            return this.entityService.getFirstPage(order, size, status).pipe(
              switchMap((items) =>
                this.entityService
                  .getTotalByStatus(status)
                  .pipe(map((total) => ItemActions.getItemsSuccess({ items, query: 'first', total })))
              ),
              catchError(error => of(ItemActions.notifyError({ error, errorType: 'list' })))
            )
          case 'next':
            return this.entityService
              .getNextPage<typeof order.key>(order, size, status, item[order.key])
              .pipe(
                map((items) => ItemActions.getItemsSuccess({ items, query: 'next', size: pageAmount })),
                catchError(error => of(ItemActions.notifyError({ error, errorType: 'list' })))
              )
          case 'previous':
            return this.entityService
              .getPreviousPage<typeof order.key>(order, size, status, item[order.key])
              .pipe(
                map((items) => ItemActions.getItemsSuccess({ items, query: 'previous', size: pageAmount })),
                catchError(error => of(ItemActions.notifyError({ error, errorType: 'list' })))
              )
          case 'custom':
            return of(ItemActions.getItemsSuccess({ items: null, query: 'custom' }))
        }
      })
    )
  )

  getItemsBySearchQuery = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItemsBySearchQuery),
      switchMap(({ request }) =>
        this.entityService.getAllByQuery(request.key, request.value).pipe(
          map((items) => ItemActions.getItemsSuccess({ items, query: 'custom', total: items.length })),
          catchError(error => of(ItemActions.notifyError({ error, errorType: 'list' })))
        )
      )
    )
  )

  getItemsSuccess = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItemsSuccess),
      tap(() => this.signalService.setLoadingStatus(LoadingStatus.LoadingSuccess))),
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

  private handleError(error, type) {
    this.signalService.setLoadingStatus(LoadingStatus.LoadingFailed)
    return of(ItemActions.notifyError({ error, errorType: type }))
  }

  ngrxOnInitEffects(): Action {
    return ItemActions.getItems({ request: this.defaultFirstPageRequest });
  }
}
