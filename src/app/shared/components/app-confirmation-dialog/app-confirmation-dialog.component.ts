import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

type ConfirmationDialog = {
  title: string,
  subtitle: string
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './app-confirmation-dialog.component.html',
  styleUrls: ['./app-confirmation-dialog.component.scss'],
})
export class AppConfirmationDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<AppConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: ConfirmationDialog
  ) { }

  confirm() {
    this.dialogRef.close(true)
  }

  close() {
    this.dialogRef.close(false)
  }

}