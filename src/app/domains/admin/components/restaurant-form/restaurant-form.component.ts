import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { showFieldErrors } from '../../../../shared/utils/form-error-handling'
import { RestaurantFormProps, restaurantFormGroup } from '../../models/restaurant.form'
import { SharedModule } from '../../../../shared/shared.module'

@Component({
  selector: 'restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class RestaurantFormComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<RestaurantFormComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any
  ) { }

  formProps = RestaurantFormProps
  form = restaurantFormGroup
  showFieldErrors = showFieldErrors

  ngOnInit(): void {
    if (this.dialogData) {
      this.form.patchValue(this.dialogData)
    }
  }

  confirm() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value)
    }
  }

  close() {
    this.dialogRef.close(false)
  }

}