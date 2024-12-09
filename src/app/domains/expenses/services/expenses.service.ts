import { Injectable } from '@angular/core'
import { RepositoryService } from '../../../shared/repository/repository.service'

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {

  constructor(private repositoryService: RepositoryService<any, any>) { }

  private readonly collection = 'Expenses'

  create(data: any) {
    return this.repositoryService.createDocument(this.collection, data)
  }

  getAll() {
    return this.repositoryService.getAllDocuments(this.collection)
  }

  delete(id: string) {
    return this.repositoryService.deleteDocument(this.collection, id)
  }

}