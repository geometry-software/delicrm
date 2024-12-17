import { EMPTY } from "rxjs";
import { RepositoryRequest } from "../repository/repository.models";

export const defaultErrorHandler = (error: Error, title: string) => {
  console.error(title);
  console.error('-----');
  console.log('Error details');
  console.log(error);
  console.error('-----');
  return EMPTY
}