import { RepositoryRequest } from "../repository/repository.model";

export const formatRequest = <T, S>(request: RepositoryRequest<T, S>, resetRequest: boolean) => ({
  size: request?.size.size,
  item: request?.pagination?.item,
  query: resetRequest ? 'first' : request?.pagination.query,
  order: request.order,
  status: request.status,
})
