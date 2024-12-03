import { MenuOption } from './navbar.model'

export const userMenuOptions: Array<MenuOption> = [
  {
    title: 'Menu',
    icon: 'menu_book',
    link: 'menu',
    roles: ['admin', 'delivery', 'waiter'],
  },
  {
    title: 'Orders',
    icon: 'playlist_add_check',
    link: 'orders',
    roles: ['admin', 'waiter'],
  },
  {
    title: 'Delivery',
    icon: 'directions_bike',
    link: 'delivery',
    roles: ['admin', 'delivery', 'waiter'],
  },
  {
    title: 'Table',
    icon: 'content_paste',
    link: 'admin/board',
    roles: ['admin'],
  },
  {
    title: 'Cash box',
    icon: 'payments',
    link: 'admin/cash-desk',
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
    title: 'Users',
    icon: 'people',
    link: 'users',
    roles: ['admin'],
  },
  {
    title: 'Profile',
    icon: 'app_settings_alt',
    link: 'profile',
    roles: ['admin', 'delivery', 'waiter'],
  },
]

export const authMenuOptions: Array<MenuOption> = [
  {
    title: 'Menu',
    icon: '/assets/images/menu.png',
    link: 'menu',
  },
  {
    title: 'Login',
    icon: '/assets/images/register.png',
    link: 'auth/login',
  },
  {
    title: 'Profile',
    icon: '/assets/images/account.png',
    link: 'auth/profile',
  },
  // {
  //   title: 'Web App',
  //   icon: '/assets/images/phone.png',
  //   link: 'info',
  // },
]
