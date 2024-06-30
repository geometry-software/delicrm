import { Injectable, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { AppConfirmationDialogComponent } from '../components/app-confirmation-dialog/app-confirmation-dialog.component'
import { filter } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  readonly matDialog: MatDialog = inject(MatDialog)

  defaultConfirm = (title: string, subtitle: string = null) =>
    this.matDialog
      .open(AppConfirmationDialogComponent, {
        width: '90%',
        height: 'auto',
        data: {
          title: title,
          subtitle: subtitle,
          autoFocus: false,
          restoreFocus: false,
        },
      })
      .afterClosed()
      .pipe(filter((value) => !!value))
}
