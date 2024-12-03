import { Component, Inject, OnInit } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { showFieldErrors } from '../../../../shared/utils/form-error-handling'
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field'
import { RestaurantFormProps, restaurantFormGroup } from '../../models/restaurant.form'
import { NgIf } from '@angular/common'
import { MatInput } from '@angular/material/input'
import { MatButton } from '@angular/material/button'

@Component({
  selector: 'restaurant-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatInput, MatLabel, MatButton, MatError, NgIf],
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss'],
})
export class RestaurantFormComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<RestaurantFormComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any) { }

  formProps = RestaurantFormProps
  form = restaurantFormGroup
  showFieldErrors = showFieldErrors

  ngOnInit(): void {
    // 
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