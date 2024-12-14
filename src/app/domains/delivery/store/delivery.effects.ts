import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects'
import {
  catchError,
  combineLatest,
  concatMap,
  EMPTY,
  forkJoin,
  map,
  of,
  switchMap,
  take,
  tap,
  withLatestFrom,
  zip,
} from 'rxjs'
import { DeliveryActions as ItemActions } from './delivery.actions'
import { Router } from '@angular/router'
import { Action, Store } from '@ngrx/store'
import { getItemsPageAmount, getResetRequestToTheFirstPage } from './delivery.selectors'
// import { OrderService } from '../services/order.service'
import { ConfirmationService } from '../../../shared/services/confirmation.service'
import { formatRequest } from '../../../shared/utils/format-request'

import { LoadingStatus } from '../../../shared/models/loading-status'
// import { OrderConstants } from '../models/order.constants'
import { SignalService } from '../../../shared/services/signal.service'
import { DeliveryService } from '../services/delivery.service'

@Injectable()
export class DeliveryEffects {

  constructor(
    private router: Router,
    private actions: Actions,
    private store: Store,
    private deliveryService: DeliveryService,
    private signalService: SignalService
  ) { }


}