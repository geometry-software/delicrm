import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ExpensesListComponent } from './expenses-list/expenses-list.component'

const ROUTES: Routes = [
  {
    path: '',
    component: ExpensesListComponent,
    data: { title: 'EXPENSES.PAGE.LIST.TOOLBAR' },
  },
]

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
})
export class ExpensesRoutingModule {}
