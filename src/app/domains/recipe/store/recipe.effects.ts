import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, mergeMap, of, switchMap, tap, withLatestFrom } from 'rxjs'
import { RecipeActions as ItemActions } from './recipe.actions'
import { RecipeEntityService } from '../services/recipe.service'
import { Recipe } from '../utils/recipe.model'
import { Router } from '@angular/router'
import { RecipeConstants } from '../utils/recipe.constants'
import { formatRequest } from '../../../shared/utils/format-request'
import { Store } from '@ngrx/store'
import { getItemsPageAmount, getResetRequestToTheFirstPage } from './recipe.selectors'
import { ConfirmationService } from '../../../shared/services/confirmation.service'

@Injectable()
export class RecipeEffects {
  constructor(
    private router: Router,
    private actions: Actions,
    private store: Store,
    private entityService: RecipeEntityService,
    private confirmationService: ConfirmationService
  ) { }

  readonly moduleUrl = RecipeConstants.moduleUrl
  readonly deleteTitle = RecipeConstants.deleteTitle
  readonly defaultCreateStatus = RecipeConstants.defaultCreateStatus

  createItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createItem),
      switchMap(({ item }) =>
        this.entityService.create(item).pipe(
          map(id => {
            // TODO: add notification through service
            // this.notificationService.notifyCreateSuccess('message)
            this.router.navigate([this.moduleUrl, id])
            return ItemActions.createItemSuccess()
          }),
          catchError((error) => of(ItemActions.notifyError({ error, errorType: 'create' })))
        )
      )
    )
  )

  updateItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateItem),
      mergeMap(({ item, id }) =>
        this.entityService.update(item, id).pipe(
          map(() => {
            // TODO: add notification through service
            // this.notificationService.notifyEditSuccess('message)
            this.router.navigate([this.moduleUrl, id])
            return ItemActions.updateItemSuccess()
          }),
          catchError((error) => of(ItemActions.notifyError({ error, errorType: 'edit' })))
        )
      )
    )
  )

  deleteItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.deleteItem),
      mergeMap(({ id }) =>
        this.confirmationService.defaultConfirm(this.deleteTitle).pipe(
          mergeMap(() =>
            this.entityService.delete(id).pipe(
              map(() => ItemActions.deleteItemSuccess()),
              catchError((error) => of(ItemActions.notifyError({ error, errorType: 'edit' })))
            )
          )
        )
      )
    )
  )

  deleteItemSuccess = createEffect(
    () =>
      this.actions.pipe(
        ofType(ItemActions.deleteItemSuccess),
        mergeMap(() => this.router.navigate([this.moduleUrl]))
      ),
    { dispatch: false }
  )

  getItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItem),
      mergeMap(({ id }) =>
        this.entityService.getById(id).pipe(
          map((item) => ItemActions.getItemSuccess({ item })),
          catchError((error) => of(ItemActions.notifyError({ error, errorType: 'create' })))
        )
      )
    )
  )

  getItems = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItems),
      withLatestFrom(this.store.select(getResetRequestToTheFirstPage), this.store.select(getItemsPageAmount)),
      mergeMap(([{ request }, resetRequest, pageAmount]) => {
        const { size, item, query, order, status } = formatRequest(request, resetRequest)
        switch (query) {
          case 'all':
            return this.entityService.getAll().pipe(
              mergeMap((items) =>
                this.entityService
                  .getTotalByStatus(status)
                  .pipe(map((total) => ItemActions.getItemsSuccess({ items, query: 'all', total })))
              ),
              catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
            )
          case 'first':
            return this.entityService.getFirstPage(order, size, status).pipe(
              mergeMap((items) =>
                this.entityService
                  .getTotalByStatus(status)
                  .pipe(map((total) => ItemActions.getItemsSuccess({ items, query: 'first', total })))
              ),
              catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
            )
          case 'next':
            return this.entityService
              .getNextPage<typeof order.key>(order, size, status, item[order.key])
              .pipe(
                map((items) => ItemActions.getItemsSuccess({ items, query: 'next', size: pageAmount })),
                catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
              )
          case 'previous':
            return this.entityService
              .getPreviousPage<typeof order.key>(order, size, status, item[order.key])
              .pipe(
                map((items) => ItemActions.getItemsSuccess({ items, query: 'previous', size: pageAmount })),
                catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
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
      mergeMap(({ request }) =>
        this.entityService.getAllByQuery(request.key, request.value).pipe(
          map((items) => ItemActions.getItemsSuccess({ items, query: 'custom', total: items.length })),
          catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
        )
      )
    )
  )

  notifyError = createEffect(
    () =>
      this.actions.pipe(
        ofType(ItemActions.notifyError),
        tap(({ error }) => console.error(error))
        // mergeMap(() => of(this.notificationService.notifyError()))
      ),
    { dispatch: false }
  )
}
