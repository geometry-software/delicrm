import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './app-confirmation-dialog.component.html',
  styleUrls: ['./app-confirmation-dialog.component.scss'],
})
export class AppConfirmationDialogComponent implements OnInit {
  isLoading: boolean

  constructor(private dialogRef: MatDialogRef<AppConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any) {}

  ngOnInit() {}

  confirm() {
    this.isLoading = !this.isLoading
    this.dialogRef.close(true)
  }

  close() {
    this.dialogRef.close(false)
  }
}
