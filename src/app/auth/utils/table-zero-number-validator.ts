import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordMatchingValidatior: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')
    const repeatPassword = control.get('repeatPassword')

    console.log(control);


    return password?.value === repeatPassword?.value ? null : { notmatched: true }
}