import { MenuOption } from './navbar.model'

export const userMenuOptions: Array<MenuOption> = [
  {
    title: 'MENU.NAVBAR',
    icon: 'menu_book',
    link: 'menu',
    roles: ['admin', 'delivery', 'waiter'],
  },
  {
    title: 'ORDERS.NAVBAR',
    icon: 'playlist_add_check',
    link: 'orders',
    roles: ['admin', 'waiter'],
  },
  {
    title: 'DELIVERY.NAVBAR',
    icon: 'directions_bike',
    link: 'delivery',
    roles: ['admin', 'delivery', 'waiter'],
  },
  {
    title: 'ADMIN.NAVBAR',
    icon: 'content_paste',
    link: 'admin',
    roles: ['admin'],
  },
  {
    title: 'SHIFTS.NAVBAR',
    icon: 'payments',
    link: 'shifts/reports',
    roles: ['admin'],
  },
  {
    title: 'RECIPES.NAVBAR',
    icon: 'edit',
    link: 'recipes',
    roles: ['admin'],
  },
  {
    title: 'EXPENSES.NAVBAR',
    icon: 'shopping_cart',
    link: 'expenses',
    roles: ['admin', 'waiter'],
  },
  {
    title: 'CLIENTS.NAVBAR',
    icon: 'face',
    link: 'clients',
    roles: ['admin', 'waiter'],
  },
  {
    title: 'USERS.NAVBAR',
    icon: 'people',
    link: 'users',
    roles: ['admin'],
  },
  {
    title: 'PROFILE.NAVBAR',
    icon: 'app_settings_alt',
    link: 'auth/profile',
    roles: ['admin', 'delivery', 'waiter'],
  },
]

export const authMenuOptions: Array<MenuOption> = [
  {
    title: 'MENU.NAVBAR',
    icon: '/assets/images/menu.png',
    link: 'menu',
  },
  {
    title: 'AUTH.NAVBAR',
    icon: '/assets/images/register.png',
    link: 'auth/login',
  },
  {
    title: 'PROFILE.NAVBAR',
    icon: '/assets/images/account.png',
    link: 'auth/profile',
  },
  // {
  //   title: 'Web App',
  //   icon: '/assets/images/phone.png',
  //   link: 'info',
  // },
]
