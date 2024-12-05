import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ExpensesFormComponent } from '../expenses-form/expenses-form.component'
import { Observable, filter, tap } from 'rxjs'
import { CdkTableDataSourceInput } from '@angular/cdk/table'
import { ExpensesService } from '../services/expenses.service'
import { SignalService } from '../../../shared/services/signal.service'

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesListComponent implements OnInit {
  dataSourceObs: Observable<CdkTableDataSourceInput<any>>
  dataSourceColumn = ['waiter', 'timestamp', 'value', 'title']

  isUpdatingOrders: boolean

  constructor(
    private dialog: MatDialog,
    private expensesService: ExpensesService,
    private route: ActivatedRoute,
    private signalService: SignalService
  ) { }

  ngOnInit() {
    this.loadMarketExpenses()
    this.initTitle()
  }

  loadMarketExpenses() {
    this.dataSourceObs = this.expensesService.getAll()
  }

  addExpenses() {
    this.dialog
      .open(ExpensesFormComponent, {
        width: '90%',
        height: 'auto',
      })
      .afterClosed()
      .pipe(
        filter(value => !!value),
        tap(value => this.expensesService.createDocument(value))
      )
      .subscribe()
  }

  initTitle() {
    this.signalService.setToolbarTitle(this.route.snapshot.data['title'])
  }
}
