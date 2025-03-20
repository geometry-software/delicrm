import { Injectable } from '@angular/core'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { DailyMenu, MenuItem, Restaurant, RestaurantInfo } from '../models/restaurant'
import { RestaurantConstants } from '../models/restaurant.constants'
import { Observable, combineLatest, map } from 'rxjs'
import { CheckoutOrder } from '../../menu/models/checkout'

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(
    private repositoryService: RepositoryService
  ) { }

  private readonly collection = RestaurantConstants.collectionName
  private readonly infoDocument = RestaurantConstants.infoDocument
  private readonly menuActiveDocument = RestaurantConstants.menuActiveDocument
  private readonly menuFormDocument = RestaurantConstants.menuFormDocument
  private readonly alacarteDocument = RestaurantConstants.alacarteDocument
  private readonly ordersDocument = RestaurantConstants.ordersDocument
  private readonly openDocument = RestaurantConstants.openDocument
  private readonly initialMenu = RestaurantConstants.initialMenu

  createRestaurant(item: Restaurant) {
    return combineLatest([
      this.repositoryService.setDocument(this.collection, item, this.infoDocument),
      this.repositoryService.setDocument(this.collection, this.initialMenu, this.menuActiveDocument),
      this.repositoryService.setDocument(this.collection, this.initialMenu, this.menuFormDocument),
      this.repositoryService.setDocument(this.collection, { alacarte: [] }, this.alacarteDocument),
      this.repositoryService.setDocument(this.collection, { orders: [] }, this.ordersDocument),
      this.repositoryService.setDocument(this.collection, { open: false }, this.openDocument),
    ])
  }

  openRestaurant(open: boolean) {
    return this.repositoryService.updateDocument(this.collection, { open }, this.openDocument)
  }

  updateRestaurantInfo(item: Restaurant) {
    return this.repositoryService.updateDocument(this.collection, item, this.infoDocument)
  }

  getRestaurantInfo(): Observable<RestaurantInfo> {
    return combineLatest([
      this.repositoryService.getDocumentById(this.collection, this.infoDocument),
      this.repositoryService.getDocumentById(this.collection, this.openDocument)
    ]).pipe(
      map(value => {
        const restaurant: Restaurant = value[0]
        const open: boolean = value[1]?.open
        return { restaurant, open }
      })
    )
  }

  createDailyMenu(menu: DailyMenu) {
    return combineLatest([
      this.repositoryService.updateDocument(this.collection, menu, this.menuActiveDocument),
      this.repositoryService.updateDocument(this.collection, menu, this.menuFormDocument),
    ])
  }

  updateEightySixDailyMenu(menu: DailyMenu) {
    return this.repositoryService.updateDocument(this.collection, menu, this.menuActiveDocument)
  }

  getActiveDailyMenu(): Observable<DailyMenu> {
    return this.repositoryService.getDocumentById(this.collection, this.menuActiveDocument)
  }

  getFormDailyMenu(): Observable<DailyMenu> {
    return this.repositoryService.getDocumentById(this.collection, this.menuFormDocument)
  }

  updateAlacarteMenu(alacarte: MenuItem[]) {
    return this.repositoryService.updateDocument(this.collection, { alacarte }, this.alacarteDocument)
  }

  getAlacarteMenu(): Observable<MenuItem[]> {
    return this.repositoryService.getDocumentById(this.collection, this.alacarteDocument).pipe(
      map(value => value?.alacarte)
    )
  }

  updateDailyOrders(orders: CheckoutOrder[]) {
    return this.repositoryService.updateDocument(this.collection, { orders }, this.ordersDocument)
  }

  getDailyOrders(): Observable<CheckoutOrder[]> {
    return this.repositoryService.getDocumentById(this.collection, this.ordersDocument).pipe(
      map(value => value?.orders)
    )
  }

}