import { RepositoryRequest } from "../repository/repository.models";

export const formatRequest = <T, S>(request: RepositoryRequest<T, S>, size: number) => ({
  size: request.size,
  item: request.pagination.item,
  query: compareItemsRequestStateSize(request.size, size) ? request.pagination.query : 'first',
  sort: request.sort,
  status: request.status,
})

export const compareItemsRequestStateSize = (requestSize: number, stateSize) => requestSize === stateSize 
