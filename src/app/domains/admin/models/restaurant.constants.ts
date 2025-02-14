import { DailyMenu } from "./restaurant"

export abstract class RestaurantConstants {
  static readonly collectionName = 'Restaurant'
  static readonly defaultCurrency = '$'
  static readonly infoDocument = 'info'
  static readonly menuDocument = 'menu'
  static readonly openDocument = 'open'
  static readonly alacarteDocument = 'alacarte'
  static readonly ordersDocument = 'orders'
  static readonly initialMenu: DailyMenu = {
    createdAt: null,
    extras: null,
    extrasAmount: {
      starters: 1,
      drinks: 1,
      sideDishes: 1,
      desserts: 1
    },
    main: []
  }
}