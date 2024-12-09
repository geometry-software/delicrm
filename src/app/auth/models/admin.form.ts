import { FormControl, FormGroup, Validators } from "@angular/forms"

export enum AdminFormProps {
    email = 'email',
    name = 'name',
    password = 'password',
    repeatPassword = 'repeatPassword'
}

export const adminFormGroup = new FormGroup({
    [AdminFormProps.email]: new FormControl(null, [Validators.required, Validators.email]),
    [AdminFormProps.name]: new FormControl(null, Validators.required),
    [AdminFormProps.password]: new FormControl(null, Validators.required),
    [AdminFormProps.repeatPassword]: new FormControl(null),
})