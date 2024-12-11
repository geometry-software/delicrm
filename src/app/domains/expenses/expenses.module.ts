import { NgModule } from '@angular/core'
import { ExpensesRoutingModule } from './expenses-routing.module'
import { ExpensesFormComponent } from './expenses-form/expenses-form.component'
import { ExpensesListComponent } from './expenses-list/expenses-list.component'
import { SharedModule } from '../../shared/shared.module'
import { ExpensesService } from './services/expenses.service'

@NgModule({
  declarations: [
    ExpensesListComponent,
    ExpensesFormComponent
  ],
  imports: [
    SharedModule,
    ExpensesRoutingModule
  ],
  providers: [ExpensesService],
})
export class ExpensesModule { }
