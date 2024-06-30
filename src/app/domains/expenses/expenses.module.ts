import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ExpensesRoutingModule } from './expenses-routing.module'
import { ExpensesFormComponent } from './expenses-form/expenses-form.component'
import { ExpensesListComponent } from './expenses-list/expenses-list.component'
import { TranslateModule } from '@ngx-translate/core'
import { SharedModule } from '../../shared/shared.module'
import { ExpensesService } from './services/expenses.service'

@NgModule({
  declarations: [ExpensesListComponent, ExpensesFormComponent],
  imports: [RouterModule, CommonModule, SharedModule, ReactiveFormsModule, ExpensesRoutingModule, TranslateModule],
  providers: [ExpensesService],
})
export class ExpensesModule {}
