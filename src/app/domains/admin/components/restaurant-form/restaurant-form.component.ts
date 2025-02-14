import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { highlightInvalidFields, showFieldErrors } from '../../../../shared/utils/form-error-handling'
import { RestaurantFormProps, restaurantFormGroup } from '../../models/restaurant.form'
import { SharedModule } from '../../../../shared/shared.module'
import { BootstrapConstants } from '../../../../bootstrap/models/bootstrap.constants'

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
  readonly languageOptions = BootstrapConstants.languageOptions

  ngOnInit(): void {
    this.form.controls[RestaurantFormProps.web].setValue(BootstrapConstants.web)
    this.form.controls[RestaurantFormProps.web].disable()
    this.form.controls[RestaurantFormProps.locale].setValue(BootstrapConstants.locale)
    this.form.controls[RestaurantFormProps.locale].disable()
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