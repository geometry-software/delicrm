import { Observable } from 'rxjs'
import { PaginationRequest } from '../models/pagination.model'
import { Sort } from '@angular/material/sort'

export type RepositoryEntity = {
  id?: string
  createdAt?: number
  updated?: Date
  status?: RepositoryEntityStatus
}

export const defaultStatusPropertyName = 'status'

export type RepositoryEntityStatus = 'active' | 'archived'

export type RepositoryRequestQuery = RepositoryRequestListQuery | 'create' | 'edit' | 'detail' | 'status' | 'log'

export type RepositoryResponseEntity<T> = {
  id: string,
  item: T
}

export type RepositoryResponseList<T> = {
  data: T[]
  current: number
  total: number
}

export type RepositoryRequesEntity<T> = {
  data: T
}

export type RepositoryRequestListQuery = 'all' | 'first' | 'next' | 'previous' | 'custom'

export type RepositoryRequest<T, S> = {
  pagination: PaginationRequest<T>
  size: number
  sort: SortRequest
  status: S
}

export type FilterRequest = {
  key: string
  value: string
}

export type SortRequest = {
  active: string
  direction: 'asc' | 'desc'
}

export type Log<T> = {
  item: T
  id: string
  createdAt: number
}