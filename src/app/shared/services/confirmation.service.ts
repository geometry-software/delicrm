import { DestroyRef, Injectable } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { AppConfirmationDialogComponent } from '../components/app-confirmation-dialog/app-confirmation-dialog.component'
import { filter } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Injectable()
export class ConfirmationService {

  constructor(
    private destroyRef: DestroyRef,
    private matDialog: MatDialog
  ) { }

  confirm(title: string, subtitle: string) {
    return this.matDialog.open(AppConfirmationDialogComponent, {
      width: '90%',
      height: 'auto',
      data: {
        title,
        subtitle,
        autoFocus: false,
        restoreFocus: false,
      },
    }).afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(Boolean))
  }

}
