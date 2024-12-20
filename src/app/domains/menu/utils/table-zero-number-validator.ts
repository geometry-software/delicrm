import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const tableZeroNumberValidator = (): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
        const value = control.value
        if (value === null || value === undefined) {
            return null
        }
        return !value ? { tableZeroNumber: true } : null
    }