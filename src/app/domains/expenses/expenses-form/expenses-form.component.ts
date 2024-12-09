import { ChangeDetectionStrategy, Component, Inject, OnInit, computed, effect } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { SignalService } from '../../../shared/services/signal.service'
import { getCurrentUnixTime } from '../../../shared/utils/format-unix-time'

@Component({
  selector: 'app-expenses-form',
  templateUrl: './expenses-form.component.html',
  styleUrls: ['./expenses-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesFormComponent implements OnInit {
  form: FormGroup
  dialogId: string
  waiter: any

  constructor(
    public dialogRef: MatDialogRef<ExpensesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private signalService: SignalService
  ) {
    effect(() => (this.waiter = this.signalService.getUserData()))
  }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.form = new FormGroup({
      title: new FormControl('', {
        validators: Validators.required,
        updateOn: 'change',
      }),
      value: new FormControl(null, {
        validators: Validators.required,
        updateOn: 'change',
      }),
    })
  }

  confirm(form) {
    let item = form.value
    item.waiter = this.waiter
    item.createdAt = getCurrentUnixTime
    this.dialogRef.close(item)
  }

  close() {
    this.dialogRef.close(false)
  }
}
