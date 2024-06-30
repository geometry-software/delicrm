import { MatDrawerMode } from '@angular/material/sidenav'
import { AuthRole } from 'src/app/auth/utils/auth.model'

export interface MenuOption {
  title?: string
  icon?: string
  link?: string
  roles?: Array<AuthRole>
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
