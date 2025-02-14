import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects'
import { catchError, combineLatest, EMPTY, map, of, switchMap, tap, withLatestFrom } from 'rxjs'
import { RecipeActions as ItemActions } from './recipe.actions'
import { RecipeService } from '../services/recipe.service'
import { Router } from '@angular/router'
import { RecipeConstants } from '../models/recipe.constants'
import { Action, Store } from '@ngrx/store'
import { ConfirmationService } from '../../../shared/services/confirmation.service'
import { SignalService } from '../../../shared/services/signal.service'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { getCurrent, getSize, getTotal } from './recipe.selectors'
import { compareItemsRequestStateSize, formatRequest } from '../../../shared/utils/format-request'
import { formatResponseList } from '../../../shared/repository/repository.utils'
import { NotificationService } from '../../../shared/services/notification.service'

@Injectable()
export class RecipeEffects implements OnInitEffects {

  constructor(
    private router: Router,
    private actions: Actions,
    private store: Store,
    private entityService: RecipeService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService,
    private signalService: SignalService
  ) { }

  readonly moduleUrl = RecipeConstants.moduleUrl
  readonly deleteTitle = RecipeConstants.deleteConfirmationTitle
  readonly deleteSubtitle = RecipeConstants.deleteConfirmationSubtitle
  readonly createNotificationTitle = RecipeConstants.createNotificationTitle
  readonly updateNotificationTitle = RecipeConstants.updateNotificationTitle
  readonly deleteNotificationTitle = RecipeConstants.deleteNotificationTitle
  readonly defaultCreateStatus = RecipeConstants.defaultCreateStatus
  readonly defaultFirstPageRequest = RecipeConstants.defaultPageRequest
  readonly form = this.entityService.form

  ngrxOnInitEffects(): Action {
    return ItemActions.getItems({ request: this.defaultFirstPageRequest })
  }

  createItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createItem),
      tap(() => this.handleLoadingRequest()),
      switchMap(({ item }) => this.entityService.create(item).pipe(
        tap(item => {
          this.handleLoadedRequest()
          this.router.navigate([this.moduleUrl])
          this.notificationService.success(this.createNotificationTitle)
        }),
        map(item => ItemActions.createItemSuccess({ item })),
        catchError(error => this.handleError(error, 'create')))))
  )

  updateItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateItem),
      tap(() => this.handleLoadingRequest()),
      switchMap(({ item, id }) => this.entityService.update(item, id).pipe(
        tap(() => {
          this.handleLoadedRequest()
          this.notificationService.success(this.updateNotificationTitle)
        }),
        catchError(error => this.handleError(error, 'edit')))))
    , { dispatch: false }
  )

  deleteItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.deleteItem),
      switchMap(({ id }) => this.confirmationService.confirm(this.deleteTitle, this.deleteSubtitle).pipe(
        tap(() => this.handleLoadingRequest()),
        switchMap(() => this.entityService.delete(id).pipe(
          tap(() => {
            this.handleLoadedRequest()
            this.notificationService.success(this.deleteNotificationTitle)
            this.router.navigate([this.moduleUrl])
          }),
          catchError(error => this.handleError(error, 'edit')))))))
    , { dispatch: false }
  )

  getItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItem),
      tap(() => this.handleLoadingRequest()),
      switchMap(({ id }) => this.entityService.getById(id).pipe(
        map(item => {
          this.handleLoadedRequest()
          return ItemActions.getItemSuccess({ item })
        }),
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
        switch (query) {
          case 'first':
            return combineLatest([
              this.entityService.getFirstPage(sort, size, status),
              this.entityService.getTotalByStatus(status),
            ]).pipe(
              tap(() => this.handleLoadedRequest()),
              switchMap(([items, amount]) =>
                [
                  ItemActions.getItemsSuccess({
                    items: formatResponseList(query, items, total, current, compareItemsRequestStateSize(size, stateSize)),
                    size
                  }),
                  ItemActions.setItemsAmount({ amount })
                ]),
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
      }))
  )

  getItemsBySearchQuery = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItemsBySearchQuery),
      tap(() => this.signalService.setLoadingStatus(LoadingStatus.Loading)),
      switchMap(({ request }) => this.entityService.getAllByQuery(request.key, request.value).pipe(
        tap(() => this.signalService.setLoadingStatus(LoadingStatus.Loaded)),
        map(items => ItemActions.getItemsSuccess({ items: formatResponseList('custom', items, items.length, items.length), size: items.length })),
        catchError(error => of(ItemActions.notifyError({ error, query: 'custom' }))))))
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
      tap(({ error }) => this.notificationService.error(error))),
    { dispatch: false }
  )

  private handleError(error, query) {
    this.signalService.setLoadingStatus(LoadingStatus.Failed)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Failed }))
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

}