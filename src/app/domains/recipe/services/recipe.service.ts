import { Injectable, inject } from '@angular/core'
import { EMPTY, Observable, delay } from 'rxjs'
import { RecipeConstants } from '../models/recipe.constants'
import { Recipe, RecipeStatus } from '../models/recipe.model'
import { OrderRequest } from '../../../shared/repository/repository.model'
import { RepositoryService } from '../../../shared/repository/repository.service'

@Injectable()
export class RecipeEntityService {

  readonly collection = RecipeConstants.collectionName
  readonly collectionLog = RecipeConstants.collectionName + '_log'
  readonly repositoryService: RepositoryService<Recipe, RecipeStatus> = inject(RepositoryService)

  getAll() {
    return this.repositoryService.getAllDocuments(this.collection)
  }

  getById(id: string) {
    return this.repositoryService.getDocumentById(this.collection, id)
  }

  getTotalByStatus(status: RecipeStatus) {
    return this.repositoryService.getCollectionSizeByStatus(this.collection, status)
  }

  getFirstPage(order: OrderRequest, size: number, status: RecipeStatus) {
    return this.repositoryService.getFirstPage(this.collection, order, size, 'status', status)
  }

  getNextPage<V>(order: OrderRequest, size: number, status: RecipeStatus, value: V) {
    return this.repositoryService.getNextPage<RecipeStatus, V>(this.collection, order, size, 'status', status, value)
  }

  getPreviousPage<V>(order: OrderRequest, size: number, status: RecipeStatus, value: V) {
    return this.repositoryService.getPreviousPage<RecipeStatus, V>(this.collection, order, size, 'status', status, value)
  }

  getAllByQuery(property: string, value: string) {
    return this.repositoryService.getAllDocumentsByIncludesQuery(this.collection, property, value)
  }

  create(item: Recipe) {
    const document: Recipe = {
      ...item,
      status: 'active',
      timestamp: new Date(),
    }
    return this.repositoryService.createDocument(this.collection, document)
  }

  update(item: Recipe, id: string) {
    return this.repositoryService.updateDocument(this.collection, item, id)
  }

  delete(id: string) {
    return this.repositoryService.deleteDocument(this.collection, id)
  }

  updateStatus(id: string, status: any) {
    return this.repositoryService.updateDocument(this.collection, { status: status }, id)
  }

}