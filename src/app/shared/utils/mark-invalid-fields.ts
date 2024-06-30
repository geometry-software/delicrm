import { FormGroup } from '@angular/forms'

export const markInvalidFields = (form: FormGroup): void => {
  Object.values(form.controls).forEach((control) => {
    if (control.invalid) {
      control.markAsTouched()
      control.markAsDirty()
      control.updateValueAndValidity()
    }
  })
}
