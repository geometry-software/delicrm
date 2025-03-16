import { Directive, HostListener, Input, Optional, Self } from "@angular/core";
import { NgControl } from "@angular/forms";
import { MatAutocomplete } from "@angular/material/autocomplete";

@Directive({
    selector: '[requiredAutocomplete]',
})
export class RequiredAutocompleteDirective {

    @Input('requiredAutocomplete') matAutoComplete!: MatAutocomplete

    constructor(private ngControl: NgControl) { }

    @HostListener('blur')
    onBlur() {
        const value = this.ngControl.control?.value;
        const matchingOptions = this.matAutoComplete.options.find(option => option.value === value)

        if (!matchingOptions) {
            this.ngControl.control?.setValue(null)
            this.ngControl.control?.setErrors({ requiredAutocomplete: true })
        }
    }
}