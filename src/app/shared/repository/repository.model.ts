import { Observable } from 'rxjs'
import { PaginationRequest } from '../models/pagination.model'

export interface RepositoryEntity {
  id?: string
  timestamp?: Date
  updated?: Date
  status?: RepositoryEntityStatus
}

export type RepositoryEntityStatus = 'active' | 'archived'
export type RepositoryEntityAction = 'create' | 'edit' | 'list' | 'detail' | 'status' | 'log'

export interface RepositoryResponseEntity<T> {
  id: string,
  item: T
}

export interface RepositoryResponseList<T> {
  data: T[]
  total: number
  current: number
  size: number
  error: Error
}

export interface RepositoryRequesEntity<T> {
  data?: T
  error?: Error
}

export type RepositoryRequestQuery = 'all' | 'first' | 'next' | 'previous' | 'custom'

export type RepositoryRequestOrder = 'desc' | 'asc'

export interface RepositoryRequest<T, S> {
  pagination: PaginationRequest<T>
  size: SizeRequest
  status: S
  order: OrderRequest
}

export interface SizeRequest {
  size: number
}

export interface FilterRequest {
  key: string
  value: string
}

export interface OrderRequest {
  key: string
  value: RepositoryRequestOrder
}

export interface Log<T> {
  item: T
  id: string
  timestamp: Date
}
