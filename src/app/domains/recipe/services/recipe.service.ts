import { Injectable, inject } from '@angular/core'
import { EMPTY, Observable, delay } from 'rxjs'
import { RecipeConstants } from '../models/recipe.constants'
import { Recipe, RecipeStatus } from '../models/recipe.model'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { getCurrentUnixTime } from '../../../shared/utils/format-unix-time'
import { SortRequest } from '../../../shared/repository/repository.models'

@Injectable({
  providedIn: 'root',
})
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

  getFirstPage(order: SortRequest, size: number, status: RecipeStatus) {
    return this.repositoryService.getFirstPage(this.collection, order, size, status)
  }

  getNextPage<V>(order: SortRequest, size: number, status: RecipeStatus, value: number) {
    return this.repositoryService.getNextPage(this.collection, order, size, value, status)
  }

  getPreviousPage<V>(order: SortRequest, size: number, status: RecipeStatus, value: number) {
    return this.repositoryService.getPreviousPage(this.collection, order, size, value, status)
  }

  getAllByQuery(property: string, value: string) {
    return this.repositoryService.getAllDocumentsByIncludesQuery(this.collection, property, value)
  }

  create(item: Recipe) {
    const document: Recipe = {
      ...item,
      status: 'active',
      createdAt: getCurrentUnixTime(),
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