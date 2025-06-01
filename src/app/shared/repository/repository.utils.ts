import { Observable, UnaryFunction, first, pipe, retry, throwError, timeout } from 'rxjs'
import { NotificationService } from '../services/notification.service'
import { RepositoryRequestListQuery, RepositoryResponseList } from './repository.models'
import moment from 'moment'

const REQUEST_TIME_LIMIT_VALUE = 10000
const REQUEST_TIME_LIMIT_ERROR_CODE = 'REQUEST_TIME_LIMIT_ERROR'

export const appendId = <T>(documents): T =>
  documents.map(value => ({
    ...value.payload.doc.data(),
    id: value.payload.doc.id,
  }))

export const responseTransform = <T>(notificationService: NotificationService):
  UnaryFunction<Observable<T>, Observable<T>> =>
  pipe(
    first(),
    timeout({
      each: REQUEST_TIME_LIMIT_VALUE,
      with: () => {
        const error = new Error('Request time too long')
        notificationService.error(error)
        return throwError(() => REQUEST_TIME_LIMIT_ERROR_CODE)
      },
    }),
    retry({ count: 2 })
  )

export const formatResponseList = <T>(query: RepositoryRequestListQuery, data: T[], total: number, current: number):
  RepositoryResponseList<T> => {
  switch (query) {
    case 'first':
      current = data.length
      break
    case 'next':
      current = data.length + current
      break
    case 'previous':
      current = !(total % current) ? current - data.length : total % current
      break
  }
  return {
    data,
    total,
    current
  }
}

export const requestDuration = (time: Date): number =>
  time ? +(moment(new Date()).diff(time, 'milliseconds') / 1000).toFixed(2) : null