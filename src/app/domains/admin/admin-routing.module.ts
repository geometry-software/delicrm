import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { MenuFormComponent } from './components/menu-form/menu-form.component'
import { MenuDetailComponent } from './components/menu-detail/menu-detail.component'
import { CashDeskComponent } from './components/cash-desk/cash-desk.component'
import { BoardLayoutComponent } from './components/board-layout/board-layout.component'
import { ImageMenuComponent } from './components/image-menu/image-menu.component'

const ROUTES: Routes = [
  {
    path: 'board',
    component: BoardLayoutComponent,
    data: { title: 'RECIPES.PAGE.LIST.TOOLBAR' },
    children: [
      {
        path: '',
        component: ImageMenuComponent,
        data: { title: 'RECIPES.PAGE.LIST.TOOLBAR' },
      },
      {
        path: 'cash-desk',
        component: CashDeskComponent,
        data: { title: 'RECIPES.PAGE.LIST.TOOLBAR' },
      },
      {
        path: 'form',
        component: MenuFormComponent,
        data: { title: 'RECIPES.PAGE.LIST.TOOLBAR' },
      },
      {
        path: 'menu/:id',
        component: MenuDetailComponent,
        data: { title: 'RECIPES.PAGE.LIST.TOOLBAR' },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
})
export class AdminRoutingModule {}
