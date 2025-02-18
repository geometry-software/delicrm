import { RepositoryRequest } from "../repository/repository.models";

export const formatRequest = <T, S>(request: RepositoryRequest<T, S>, size: number) => ({
  size: request.size,
  item: request.pagination.item,
  query: request.pagination.query,
  sort: request.sort,
  status: request.status,
})

export const compareItemsRequestStateSize = (requestSize: number, stateSize) => requestSize === stateSize 
