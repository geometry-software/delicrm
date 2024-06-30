import { AbstractControl } from '@angular/forms'

export const getErrorMessage = (control: AbstractControl): string => {
  if (control.hasError('required')) {
    return 'Field is required'
  } else if (control.hasError('email')) {
    return 'Not a valid email'
  } else {
    return ''
  }
}
