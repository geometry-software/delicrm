import { AbstractControl } from "@angular/forms";

export const requiredAutocompleteValidator = (control: AbstractControl) => {
    const selection = control.value?.id
    return selection
        ? null
        : { requiredAutocomplete: true }
}