import { DailyMenu } from "./restaurant"

export abstract class RestaurantConstants {
  static readonly collectionName = 'Restaurant'
  static readonly defaultCurrency = '$'
  static readonly infoDocument = 'info'
  static readonly menuActiveDocument = 'menu_active'
  static readonly menuFormDocument = 'menu_form'
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
  static readonly fontOptions = [
    { value: '20px', title: 1 },
    { value: '30px', title: 2 },
    { value: '40px', title: 3 },
    { value: '50px', title: 4 },
    { value: '60px', title: 5 },
    { value: '70px', title: 6 },
    { value: '80px', title: 7 },
    { value: '90px', title: 8 },
    { value: '100px', title: 9 }
  ]
}