import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { highlightInvalidFields, showFieldErrors } from '../../../../shared/utils/form-error-handling'
import { RestaurantFormProps, restaurantFormGroup } from '../../models/restaurant.form'
import { SharedModule } from '../../../../shared/shared.module'

@Component({
  selector: 'restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss'],
  standalone: true,
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestaurantFormComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<RestaurantFormComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) { }

  readonly formProps = RestaurantFormProps
  readonly form = restaurantFormGroup
  readonly showFieldErrors = showFieldErrors

  ngOnInit(): void {
    if (this.dialogData) {
      this.form.patchValue(this.dialogData)
    }
  }

  confirm() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value)
    } else {
      highlightInvalidFields(this.form)
    }
  }

  close() {
    this.dialogRef.close(false)
  }

}