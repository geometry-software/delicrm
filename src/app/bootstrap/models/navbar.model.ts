import { MatDrawerMode } from '@angular/material/sidenav'
import { UserRole } from '../../domains/users/utils/user.model'

export interface MenuOption {
  title?: string
  icon?: string
  link?: string
  roles?: Array<UserRole>
  hidden?: boolean
}

export interface ResponsiveLayout {
  isDesktop?: boolean
  matDrawerMode?: MatDrawerMode
  matDrawerContentHeight?: string
  matDrawerContentBackgroundColor?: string
  matToolbarBackgroundColor?: string
  matToolbarRowButtonMargin?: string
  routerOutletContainerBackgroundColor?: string
  routerOutletContainerMargin?: string
  routerOutletContainerHeight?: string
  routerOutletBorderRadius?: string
  menuListContainerMargin?: string
}
