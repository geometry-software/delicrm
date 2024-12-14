import { RepositoryRequestListQuery } from '../repository/repository.models'

export interface PaginationRequest<T> {
  query: RepositoryRequestListQuery
  item: T
}

export interface PaginationResponse<T> {
  item: PaginationItem<T>
  options?: PaginationOptions
  responseTime?: number
}

export interface PaginationItem<T> {
  first: T
  last: T
}

export interface PaginationOptions {
  current: number
  total: number
  title: string
  sizeList: Array<number>
}
