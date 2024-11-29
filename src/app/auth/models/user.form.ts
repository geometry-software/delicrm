import { FormControl, FormGroup, Validators } from "@angular/forms";

export enum UserFormProps {
    email = 'email',
    name = 'name',
}

export const userformGroup = new FormGroup({
    [UserFormProps.email]: new FormControl(null, Validators.required),
    [UserFormProps.name]: new FormControl(null, Validators.required),
    // [UserFormProps.repeatPassword]: new FormControl(null),
})