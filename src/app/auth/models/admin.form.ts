import { FormControl, FormGroup, Validators } from "@angular/forms"
import { passwordMatchingValidatior } from "../utils/table-zero-number-validator"

export enum AdminFormProps {
    email = 'email',
    password = 'password',
    repeatPassword = 'repeatPassword',
}

export const adminFormGroup = new FormGroup({
    [AdminFormProps.email]: new FormControl(null, [Validators.required, Validators.email]),
    [AdminFormProps.password]: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z0-9]*$')]),
    [AdminFormProps.repeatPassword]: new FormControl(null, [Validators.required, Validators.minLength(6)]),
}, { validators: passwordMatchingValidatior })

export const adminLoginFormGroup = new FormGroup({
    [AdminFormProps.email]: new FormControl(null, [Validators.required, Validators.email]),
    [AdminFormProps.password]: new FormControl(null, Validators.required),
})