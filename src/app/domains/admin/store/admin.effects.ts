import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, mergeMap, of, switchMap, tap, withLatestFrom } from 'rxjs'
import { AdminActions as ItemActions } from './admin.actions'
import { Router } from '@angular/router'
import { AdminConstants } from '../utils/admin.constants'
import { formatRequest } from '../../../shared/utils/format-request'
import { Store } from '@ngrx/store'
import { AdminService } from '../services/admin.service'
import { ConfirmationService } from '../../../shared/services/confirmation.service'

@Injectable()
export class AdminEffects {
  constructor(
    private router: Router,
    private actions: Actions,
    private store: Store,
    private entityService: AdminService,
    private confirmationService: ConfirmationService
  ) { }

  readonly moduleUrl = AdminConstants.moduleUrl
  readonly deleteTitle = AdminConstants.deleteTitle
  readonly defaultCreateStatus = AdminConstants.defaultCreateStatus

  printMenu = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.printMenu),
      map(({ print }) => ItemActions.printMenuSuccess({ print }))
    )
  )
}
