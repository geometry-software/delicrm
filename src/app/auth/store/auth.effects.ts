import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import {
  catchError,
  combineLatest,
  concatMap,
  forkJoin,
  map,
  mergeMap,
  of,
  switchMap,
  take,
  tap,
  withLatestFrom,
  zip,
} from 'rxjs'
import { AuthActions as ItemActions } from './auth.actions'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { getItemsPageAmount, getResetRequestToTheFirstPage } from './auth.selectors'
import { AuthService } from '../services/auth.service'
import { AuthConstants } from '../utils/auth.constants'
import { AuthStatus, AuthUser } from '../utils/auth.model'
import { formatRequest } from 'src/app/shared/utils/format-request'
import { formatAuthUser } from '../utils/format-auth-user'
import { ConfirmationService } from 'src/app/shared/services/confirmation.service'

@Injectable()
export class AuthEffects {
  constructor(
    private router: Router,
    private actions$: Actions,
    private store$: Store,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) {}

  readonly moduleUrl = AuthConstants.moduleUrl
  readonly confirmationTitleStart = AuthConstants.confirmationTitleStart
  readonly confirmationTitleEnd = AuthConstants.confirmationTitleEnd
  readonly defaultCreateStatus = AuthConstants.defaultCreateStatus
  readonly defaultFirstPageRequest = AuthConstants.defaultFirstPageRequest

  loginWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.loginWithGoogle),
      mergeMap(() =>
        this.authService.loginWithGoogle().pipe(
          map(({ additionalUserInfo, user }) => ItemActions.verifyAuthUser({ additionalUserInfo, uid: user.uid })),
          catchError((error) => of(ItemActions.notifyError({ error, errorType: 'create' })))
        )
      )
    )
  )

  verifyAuthUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.verifyAuthUser),
      mergeMap(({ additionalUserInfo, uid }) => {
        console.log(uid)

        const item = formatAuthUser(additionalUserInfo.profile, uid, additionalUserInfo.providerId)
        if (additionalUserInfo.isNewUser) {
          return this.authService.create<AuthUser>(item, uid).pipe(
            map(() => ItemActions.createUserSuccess({ item })),
            catchError((error) => of(ItemActions.notifyError({ error, errorType: 'create' })))
          )
        } else {
          console.log('has auth')
          return of()
          // return this.authService.update<AuthUser>({ status: 'requested' }, uid).pipe(
          //   map(() => {
          //     return ItemActions.updateUserSuccess({ item })
          //   }),
          //   catchError((error) => of(ItemActions.notifyError({ error, errorType: 'create' })))
          // )
        }
      })
    )
  )

  updateUserStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.updateUserStatus),
      mergeMap(({ item, status }) =>
        this.confirmationService.defaultConfirm(this.confirmationTitleStart + status + this.confirmationTitleEnd, item.name).pipe(
          mergeMap(() =>
            this.authService.updateStatus<AuthStatus>(status, item.uid).pipe(
              map(() => ItemActions.updateUserStatusSuccess()),
              catchError((error) => of(ItemActions.notifyError({ error, errorType: 'edit' })))
            )
          )
        )
      )
    )
  )

  updateUserStatusSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.updateUserStatusSuccess),
      mergeMap(() => of(ItemActions.getUsersTotalAmount(), ItemActions.getItems({ request: this.defaultFirstPageRequest })))
    )
  )

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ItemActions.logOut),
        mergeMap(() => this.authService.logout().pipe(map(() => this.router.navigate(['auth/login']))))
      ),
    { dispatch: false }
  )

  updateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.updateItem),
      mergeMap(({ item, id }) =>
        this.authService.update<AuthUser>(item, id).pipe(
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

  getItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.getItem),
      mergeMap(({ id }) =>
        this.authService.getById<AuthUser>(id).pipe(
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
      switchMap(([{ request }, resetRequest, pageAmount]) => {
        const { size, item, query, order, status } = formatRequest<AuthUser, AuthStatus>(request, resetRequest)
        switch (query) {
          case 'first':
            return combineLatest([
              this.authService.getTotalLabels(),
              this.authService.getFirstPage<AuthUser, AuthStatus>(order, size, status),
            ]).pipe(
              map(([listLabelAmount, items]) =>
                ItemActions.getItemsSuccess({
                  items,
                  query: 'first',
                  total: items.length,
                  listLabelAmount,
                })
              ),
              catchError((error) => of(ItemActions.notifyError({ error, errorType: 'edit' })))
            )
          case 'next':
            return this.authService
              .getNextPage<AuthUser, AuthStatus, typeof order.key>(order, size, status, item[order.key])
              .pipe(
                map((items) =>
                  ItemActions.getItemsSuccess({
                    items,
                    query: 'next',
                    size: pageAmount,
                  })
                ),
                catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
              )
          case 'previous':
            return this.authService
              .getPreviousPage<AuthUser, AuthStatus, typeof order.key>(order, size, status, item[order.key])
              .pipe(
                map((items) =>
                  ItemActions.getItemsSuccess({
                    items,
                    query: 'previous',
                    size: pageAmount,
                  })
                ),
                catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
              )
          default:
            return of(ItemActions.getItemsSuccess({ items: null, query: 'custom' }))
        }
      })
    )
  )

  getItemsBySearchQuery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.getItemsBySearchQuery),
      mergeMap(({ request }) =>
        this.authService.getAllByQuery<AuthUser>(request.key, request.value).pipe(
          map((items) =>
            ItemActions.getItemsSuccess({
              items,
              query: 'custom',
              total: items.length,
            })
          ),
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
