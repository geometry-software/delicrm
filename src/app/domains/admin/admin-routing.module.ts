import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { MenuFormComponent } from './components/daily-menu-form/menu-form.component'
import { ReportsComponent } from './components/reports/reports.component'
import { BoardLayoutComponent } from './components/board-layout/board-layout.component'
import { ImageMenuComponent } from './components/image-menu/image-menu.component'
import { ShiftReportComponent } from './components/shift-report/shift-report.component'
import { ToolbarGuard } from '../../shared/guards/toolbar.guard'
import { AlacarteMenuComponent } from './components/alacarte-menu/alacarte-menu.component'

const routes: Routes = [
  {
    path: '',
    component: BoardLayoutComponent,
    children: [
      {
        path: '',
        component: ImageMenuComponent,
        data: { title: 'ADMIN.TOOLBAR.BOARD' },
        canActivate: [ToolbarGuard],
      },
      {
        path: 'daily',
        component: MenuFormComponent,
        data: { title: 'ADMIN.TOOLBAR.MENU_FORM' },
        canActivate: [ToolbarGuard],
      },
      {
        path: 'alacarte',
        component: AlacarteMenuComponent,
        data: { title: 'ADMIN.TOOLBAR.ALACARTE_FORM' },
        canActivate: [ToolbarGuard],
      },
      {
        path: 'reports',
        component: ReportsComponent,
        data: { title: 'ADMIN.TOOLBAR.REPORTS' },
        canActivate: [ToolbarGuard],
      },
      {
        path: 'reports/:id',
        component: ShiftReportComponent,
        data: { title: 'ADMIN.TOOLBAR.REPORT' },
        canActivate: [ToolbarGuard],
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AdminRoutingModule { }
