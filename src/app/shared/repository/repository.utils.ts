import { Observable, UnaryFunction, auditTime, debounceTime, first, pipe, retry, take, throttleTime, throwError, timeout } from 'rxjs'
import { NotificationService } from '../services/notification.service'
import { RepositoryRequestQuery } from './repository.model'
import * as moment from 'moment'

const REQUEST_TIME_LIMIT_VALUE = 5000
const REQUEST_TIME_LIMIT_ERROR_CODE = 'REQUEST_TIME_LIMIT_ERROR'

export const appendId = <T>(documents): T =>
  documents.map(value => ({
    ...value.payload.doc.data(),
    id: value.payload.doc.id,
  }))

export const responseTransform = <T>(
  notificationService: NotificationService = null
): UnaryFunction<Observable<T>, Observable<T>> => pipe(
  first(),
  timeout({
    each: REQUEST_TIME_LIMIT_VALUE,
    with: () => {
      // notificationService.notifyConnectionWarning()
      return throwError(() => REQUEST_TIME_LIMIT_ERROR_CODE)
    },
  }),
  retry({ count: 2 }))

export const formatPaginationData = (query: RepositoryRequestQuery, items, responseLength, total, size) => {
  let current, responseTotal
  switch (query) {
    case 'first':
      responseTotal = total
      current = responseLength
      break
    case 'next':
      responseTotal = items.total
      current = items.current + responseLength
      break
    case 'previous':
      responseTotal = items.total
      current = items.current - size
      break
    case 'custom':
      responseTotal = total
      current = responseLength
      break
  }
  return {
    responseTotal,
    current,
  }
}

export const requestDuration = (time: Date): number =>
  time ? +(moment(new Date()).diff(time, 'milliseconds') / 1000).toFixed(2) : null
