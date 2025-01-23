import { AbstractControl, FormGroup } from '@angular/forms'

export const highlightInvalidFields = (form: FormGroup) => {
  Object.values(form.controls).forEach((control) => {
    if (control.invalid) {
      control.markAsTouched()
      control.markAsDirty()
      control.updateValueAndValidity()
    }
  })
}

export const showFieldErrors = (form: FormGroup, name: string) => {
  const control = form.controls[name]
  const isInvalid = control.invalid && control.touched
  if (isInvalid) {
    return getErrorMessage(control)
  }
  return null
}

const getErrorMessage = (control: AbstractControl): string => {
  if (control.hasError('required')) {
    return 'FORM.FIELD_ERROR_MESSAGE.REQUIRED'
  } else if (control.hasError('email')) {
    return 'FORM.FIELD_ERROR_MESSAGE.EMAIL'
  } else if (control.hasError('tableZeroNumber')) {
    return 'FORM.FIELD_ERROR_MESSAGE.ZERO_TABLE_NUMBER'
  } else {
    return 'FORM.FIELD_ERROR_MESSAGE.DEFAULT'
  }
}