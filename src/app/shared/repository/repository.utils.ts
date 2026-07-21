import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore'
import { RepositoryRequestListQuery, RepositoryResponseList } from './repository.models'
import moment from 'moment'

export const responseConverter = <T extends DocumentData>() => ({
  toFirestore(data: T): DocumentData {
    return data
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): T {
    return {
      id: snapshot.id,
      ...snapshot.data(options),
    } as unknown as T
  }})

export const formatResponseList = <T>(query: RepositoryRequestListQuery, data: T[], total: number, current: number): RepositoryResponseList<T> => {
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