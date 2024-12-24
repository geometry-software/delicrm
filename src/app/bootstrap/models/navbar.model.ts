import { MatDrawerMode } from '@angular/material/sidenav'
import { UserRole } from '../../domains/users/models/user.model'

export interface MenuOption {
  title?: string
  icon?: string
  link?: string
  roles?: Array<UserRole>
}

export interface ResponsiveLayout {
  isDesktop?: boolean
  matDrawerMode?: MatDrawerMode
  matToolbarRowButtonMargin?: string
  menuListContainerMargin?: string
}
