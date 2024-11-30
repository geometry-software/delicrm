import { Injectable } from '@angular/core'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { AdminConstants } from '../utils/admin.constants'
import { Restaurant } from '../models/restaurant'

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {

  constructor(
    private repositoryService: RepositoryService,
  ) { }

  private readonly collection = AdminConstants.restaurantCollectionName

  create(item: Restaurant) {
    return this.repositoryService.createDocument(this.collection, item)
  }

  update(item: Restaurant, id: string) {
    return this.repositoryService.setDocument(this.collection, item, id)
  }

}