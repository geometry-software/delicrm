import { FormControl, FormGroup, Validators } from "@angular/forms";

export const adminForm = new FormGroup({
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    repeatPassword: new FormControl(null, Validators.required),
})