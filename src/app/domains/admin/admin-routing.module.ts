import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { MenuFormComponent } from './components/menu-form/menu-form.component'
import { CashDeskComponent } from './components/cash-desk/cash-desk.component'
import { BoardLayoutComponent } from './components/board-layout/board-layout.component'
import { ImageMenuComponent } from './components/image-menu/image-menu.component'
import { ShiftReportComponent } from './components/shift-report/shift-report.component'

const routes: Routes = [
  {
    path: '',
    component: BoardLayoutComponent,
    data: { title: 'RECIPES.PAGE.LIST.TOOLBAR' },
    children: [
      {
        path: '',
        component: ImageMenuComponent,
        data: { title: 'RECIPES.PAGE.LIST.TOOLBAR' },
      },
      {
        path: 'report',
        component: CashDeskComponent,
        data: { title: 'RECIPES.PAGE.LIST.TOOLBAR' },
      },
      {
        path: 'report/:id',
        component: ShiftReportComponent
      },
      {
        path: 'form',
        component: MenuFormComponent,
        data: { title: 'RECIPES.PAGE.LIST.TOOLBAR' },
      }
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AdminRoutingModule { }
