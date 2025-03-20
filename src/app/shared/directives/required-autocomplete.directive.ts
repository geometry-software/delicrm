import { Directive, HostListener, Input } from "@angular/core";
import { NgControl } from "@angular/forms";
import { MatAutocomplete } from "@angular/material/autocomplete";

@Directive({
    selector: '[requiredAutocomplete]',
})
export class RequiredAutocompleteDirective {

    constructor(private ngControl: NgControl) { }

    @Input('requiredAutocomplete') matAutoComplete!: MatAutocomplete

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