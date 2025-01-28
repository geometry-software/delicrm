import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ExpensesListComponent } from './expenses-list/expenses-list.component'
import { ToolbarGuard } from '../../shared/guards/toolbar.guard'

const routes: Routes = [
  {
    path: '',
    component: ExpensesListComponent,
    data: { title: 'EXPENSES.TOOLBAR' },
    canActivate: [ToolbarGuard],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ExpensesRoutingModule { }
