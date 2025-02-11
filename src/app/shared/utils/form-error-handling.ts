import { AbstractControl, FormArray, FormGroup } from '@angular/forms'
import { isNil } from 'lodash'

export const highlightInvalidFields = (form: FormGroup) => {
  Object.values(form.controls).forEach(control => {
    if (control.invalid) {
      control.markAsTouched()
      control.markAsDirty()
      control.updateValueAndValidity()
    }
    if (control['controls']) {
      control['controls'].forEach(element => {
        if (element.invalid) {
          element.markAsTouched()
          element.markAsDirty()
          element.updateValueAndValidity()
        }
      })
    }
  })
}

export const showFieldErrors = (form: FormGroup, name: string, i: number = null) => {
  if (!isNil(i)) {
    const control = ((form.controls[name]) as FormArray).controls[i]
    const isInvalid = control.invalid && control.touched
    if (isInvalid) {
      return getErrorMessage(control)
    }
    return null
  } else if (typeof name === 'string') {
    const control = form.get(name)
    const isInvalid = control.invalid && control.touched
    if (isInvalid) {
      return getErrorMessage(control)
    }
    return null
  } else {
    return null
  }
}

const getErrorMessage = (control: AbstractControl): string => {
  if (control.hasError('required')) {
    return 'FORM.FIELD_ERROR_MESSAGE.REQUIRED'
  } else if (control.hasError('email')) {
    return 'FORM.FIELD_ERROR_MESSAGE.EMAIL'
  } else if (control.hasError('minlength')) {
    return 'FORM.FIELD_ERROR_MESSAGE.EMAIL'
  } else if (control.hasError('tableZeroNumber')) {
    return 'FORM.FIELD_ERROR_MESSAGE.ZERO_TABLE_NUMBER'
  } else {
    return 'FORM.FIELD_ERROR_MESSAGE.DEFAULT'
  }
}