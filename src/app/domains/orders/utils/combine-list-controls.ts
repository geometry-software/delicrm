import { FormControl } from '@angular/forms'
import { Sort } from '@angular/material/sort'
import { Store } from '@ngrx/store'
import { combineLatest, map, Observable, startWith, tap } from 'rxjs'
import { OrderActions as ItemActions } from '../store/order.actions'
import { OrderStatus } from '../models/order.model'
import { SortRequest } from '../../../shared/repository/repository.models'

export const combineListControls = <S>(pagination: FormControl, size: FormControl, sort: FormControl, status: Observable<S>) =>
  combineLatest([
    pagination.valueChanges.pipe(startWith(pagination.value)),
    size.valueChanges.pipe(
      startWith(size.value)
    ),
    sort.valueChanges.pipe(
      startWith(sort.value),
      map((sort: Sort): SortRequest => ({ active: sort.active, direction: sort.direction === '' ? 'desc' : sort.direction }))
    ),
    status
  ])
