import { Injectable } from '@angular/core'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { DailyMenu, MenuItem, Restaurant } from '../models/restaurant'
import { RestaurantConstants } from '../models/restaurant.constants'
import { EMPTY, Observable, map, switchMap } from 'rxjs'
import { Shift } from '../models/shift'
import { CheckoutOrder } from '../../menu/models/checkout'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(
    private repositoryService: RepositoryService
  ) { }

  private readonly collection = RestaurantConstants.collectionName
  private readonly infoDocument = RestaurantConstants.infoDocument
  private readonly menuDocument = RestaurantConstants.menuDocument

  createRestaurant(item: Restaurant) {
    return this.repositoryService.setDocument(this.collection, item, this.infoDocument).pipe(
      switchMap(() => this.repositoryService.setDocument(this.collection, this.getInitialDailyMenu(), this.menuDocument))
    )
  }

  updateRestaurantInfo(item: Restaurant) {
    return this.repositoryService.updateDocument(this.collection, item, this.infoDocument)
  }

  getRestaurantInfo(): Observable<Restaurant> {
    return this.repositoryService.getDocumentById(this.collection, this.infoDocument)
  }

  updateDailyMenu(menu: DailyMenu) {
    return this.repositoryService.updateDocument(this.collection, menu, this.menuDocument)
  }

  cleanDailyMenu() {
    return this.repositoryService.updateDocument(this.collection, { open: false }, this.menuDocument)
  }

  updateDailyMenuOrders(orders: CheckoutOrder[]) {
    return this.repositoryService.updateDocument(this.collection, { orders }, this.menuDocument)
  }

  getDailyMenu(): Observable<DailyMenu> {
    return this.repositoryService.getDocumentById(this.collection, this.menuDocument)
  }

  getCheckOutOrders() {
    return this.repositoryService.getDocumentById(this.collection, this.menuDocument).pipe(
      map(menu => menu.orders)
    )
  }

  updateMenuWithEightySix(menu: DailyMenu) {
    return this.repositoryService.updateDocument(this.collection, menu, this.menuDocument)
  }

  calulatedMenuWithEightySix(menu: DailyMenu, id: string) {
    const updatedMain = menu.main.map(item => this.updateItemEightySix(item, id))
    const updatedAlacarte = (menu.alacarte ?? []).map(item => this.updateItemEightySix(item, id))
    const updatedStarters = menu.extras.starters.map(item => this.updateItemEightySix(item, id))
    const updatedDrinks = menu.extras.drinks.map(item => this.updateItemEightySix(item, id))
    const updatedDesserts = menu.extras.desserts.map(item => this.updateItemEightySix(item, id))
    const updatedSideDishes = menu.extras.sideDishes.map(item => this.updateItemEightySix(item, id))
    const updatedMenu: DailyMenu = {
      ...menu,
      main: updatedMain,
      alacarte: updatedAlacarte,
      extras: {
        drinks: updatedDrinks,
        starters: updatedStarters,
        sideDishes: updatedSideDishes,
        desserts: updatedDesserts
      }
    }
    return updatedMenu
  }

  private updateItemEightySix(item: MenuItem, id: string) {
    if (item.id === id) {
      item.eightySix = !item.eightySix
      return item
    } else {
      return item
    }
  }

  private getInitialDailyMenu() {
    const menu: DailyMenu = {
      createdAt: null,
      extras: null,
      extrasAmount: {
        starters: 0,
        drinks: 0,
        sideDishes: 0,
        desserts: 0
      },
      main: [],
      open: false,
      orders: [],
      alacarte: []
    }
    return menu
  }

}