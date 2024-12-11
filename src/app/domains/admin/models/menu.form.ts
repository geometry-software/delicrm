import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms"

export enum MenuFormProps {
    starters = 'starters',
    drinks = 'drinks',
    salad = 'salad',
    rice = 'rice',
    garnish = 'garnish',
    dessert = 'dessert',
}

export const menuFormGroup = new FormGroup({
    [MenuFormProps.starters]: new FormArray([], Validators.required),
    [MenuFormProps.drinks]: new FormArray([], Validators.required),
    [MenuFormProps.salad]: new FormControl(null, Validators.required),
    [MenuFormProps.rice]: new FormControl(null, Validators.required),
    [MenuFormProps.garnish]: new FormControl(null, Validators.required),
    [MenuFormProps.dessert]: new FormControl(null, Validators.required),
})