import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, mergeMap, of, switchMap, tap, withLatestFrom } from 'rxjs'
import { DeliveryActions as ItemActions } from './delivery.actions'
import { DeliveryEntityService } from '../services/recipe.service'
import { Router } from '@angular/router'
import { ConfirmationService } from 'src/app/shared/services/confirmation.service'
import { DeliveryConstants } from '../utils/delivery.constants'
import { formatRequest } from '../../../shared/utils/format-request'
import { Store } from '@ngrx/store'
import { getItemsPageAmount, getResetRequestToTheFirstPage } from './delivery.selectors'
import { Order, OrderStatusValue } from '../../menu/utils/waiter.model'

@Injectable()
export class DeliveryEffects {
  constructor(
    private router: Router,
    private actions$: Actions,
    private store$: Store,
    private entityService: DeliveryEntityService,
    private confirmationService: ConfirmationService
  ) {}

  readonly moduleUrl = DeliveryConstants.moduleUrl
  readonly deleteTitle = DeliveryConstants.deleteTitle
  readonly defaultCreateStatus = DeliveryConstants.defaultCreateStatus

  createItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.createItem),
      switchMap(({ item }) =>
        this.entityService.create<Order>(item).pipe(
          map((response) => {
            // TODO: add notification through service
            // this.notificationService.notifyCreateSuccess('message)
            this.router.navigate([this.moduleUrl, response.id])
            return ItemActions.createItemSuccess()
          }),
          catchError((error) => of(ItemActions.notifyError({ error, errorType: 'create' })))
        )
      )
    )
  )

  updateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.updateItem),
      mergeMap(({ item, id }) =>
        this.entityService.update<Order>(item, id).pipe(
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

  deleteItem$ = createEffect(() =>
    this.actions$.pipe(
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

  deleteItemSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ItemActions.deleteItemSuccess),
        mergeMap(() => this.router.navigate([this.moduleUrl]))
      ),
    { dispatch: false }
  )

  getItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.getItem),
      mergeMap(({ id }) =>
        this.entityService.getById<Order>(id).pipe(
          map((item) => ItemActions.getItemSuccess({ item })),
          catchError((error) => of(ItemActions.notifyError({ error, errorType: 'create' })))
        )
      )
    )
  )

  getItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.getItems),
      withLatestFrom(this.store$.select(getResetRequestToTheFirstPage), this.store$.select(getItemsPageAmount)),
      mergeMap(([{ request }, resetRequest, pageAmount]) => {
        const { size, item, query, order, status } = formatRequest<Order, OrderStatusValue>(request, resetRequest)
        console.log(size)
        console.log(item)

        console.log(query)
        console.log(order)
        console.log(status)

        switch (query) {
          case 'all':
            return this.entityService.getAll<Order>().pipe(
              mergeMap((items) =>
                this.entityService
                  .getTotalByStatus<OrderStatusValue>(status)
                  .pipe(map((total) => ItemActions.getItemsSuccess({ items, query: 'all', total })))
              ),
              catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
            )
          case 'first':
            return this.entityService
              .getFirstPage<Order, OrderStatusValue>(order, size, status)
              .pipe(
                tap((value) => {
                  console.log(value)
                  value.forEach((el) => console.log(el.timestamp))
                })
              )
              .pipe(
                mergeMap((items) =>
                  this.entityService
                    .getTotalByStatus<OrderStatusValue>(status)
                    .pipe(map((total) => ItemActions.getItemsSuccess({ items, query: 'first', total })))
                ),
                catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
              )
          case 'next':
            console.log(item[order.key])
            console.log(item.timestamp)
            return this.entityService
              .getNextPage<Order, OrderStatusValue, Date>(order, size, status, item.timestamp)

              .pipe(
                map((items) => ItemActions.getItemsSuccess({ items, query: 'next', size: pageAmount })),
                catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
              )
          case 'previous':
            return this.entityService
              .getPreviousPage<Order, OrderStatusValue, typeof order.key>(order, size, status, item[order.key])
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

  getItemsBySearchQuery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.getItemsBySearchQuery),
      mergeMap(({ request }) =>
        this.entityService.getAllByQuery<Order>(request.key, request.value).pipe(
          map((items) => ItemActions.getItemsSuccess({ items, query: 'custom', total: items.length })),
          catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
        )
      )
    )
  )

  notifyError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ItemActions.notifyError),
        tap(({ error }) => console.error(error))
        // mergeMap(() => of(this.notificationService.notifyError()))
      ),
    { dispatch: false }
  )
}
