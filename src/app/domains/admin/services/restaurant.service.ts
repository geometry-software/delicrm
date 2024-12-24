import { Injectable } from '@angular/core'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { DailyMenu, Restaurant } from '../models/restaurant'
import { RestaurantConstants } from '../models/restaurant.constants'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private repositoryService: RepositoryService) { }

  private readonly collection = RestaurantConstants.collectionName
  private readonly infoDocument = RestaurantConstants.infoDocument
  private readonly menuDocument = RestaurantConstants.menuDocument

  createRestaurant(item: Restaurant) {
    return this.repositoryService.setDocument(this.collection, item, this.infoDocument)
  }

  updateRestaurant(item: Restaurant) {
    return this.repositoryService.updateDocument(this.collection, item, this.infoDocument)
  }

  updateDailyMenu(menu: DailyMenu) {
    return this.repositoryService.setDocument(this.collection, menu, this.menuDocument)
  }

  clearDailyMenu() {
    return this.repositoryService.updateDocument(this.collection, { open: false }, this.menuDocument)
  }

  getDailyMenu(): Observable<DailyMenu> {
    return this.repositoryService.getDocumentById(this.collection, this.menuDocument)
  }

}