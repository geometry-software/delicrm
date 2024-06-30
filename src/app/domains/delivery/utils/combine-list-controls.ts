import { FormControl } from '@angular/forms'
import { Sort } from '@angular/material/sort'
import { Store } from '@ngrx/store'
import { combineLatest, map, startWith, tap } from 'rxjs'
import { DeliveryActions as ItemActions } from '../store/delivery.actions'

export const combineListControls = (pagination: FormControl, size: FormControl, store$: Store) =>
  combineLatest([
    pagination.valueChanges.pipe(startWith(pagination.value)),
    size.valueChanges.pipe(
      startWith(size.value)
      // tap(() => store$.dispatch(ItemActions.resetRequestToTheFirstPage()))
    ),
    // order.valueChanges.pipe(
    //   startWith(order.value),
    //   tap(() => store$.dispatch(ItemActions.resetRequestToTheFirstPage())),
    //   map((sort: Sort) => ({ key: sort.active, value: sort.direction ? sort.direction : 'desc' }))
    // ),
  ])
