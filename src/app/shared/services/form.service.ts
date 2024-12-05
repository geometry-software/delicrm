import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Validators, FormBuilder, FormControl, ValidatorFn, FormGroup } from '@angular/forms'
import { Observable, combineLatest, map, of, switchMap } from 'rxjs'
import { CustomFormControl, FormLayout } from '../models/form.model'

@Injectable({ providedIn: 'root' })
export class FormService {
  readonly httpClient: HttpClient = inject(HttpClient)
  readonly formGroup: FormGroup = inject(FormBuilder).group({})

  getFormLayout = <T>(url: string): Observable<FormLayout<T>> =>
    this.transformJsonToObject(url).pipe(
      switchMap((json) =>
        combineLatest([of(this.createControls(json)), of(json)]).pipe(
          map(value => ({
            formGroup: value[0],
            formControls: value[1],
          }))
        )
      )
    )

  transformFormValueToCreateObject = <T, S>(form: FormGroup, status: S): T => ({ ...form.value, status, timestamp: new Date() })

  transformFormValueToUpdateObject = <T, S>(form: FormGroup, status: S, id: string): T => ({ ...form.value, status, id, updated: new Date() })

  highlightInvalidFields(form: FormGroup): void {
    Object.values(form.controls).forEach((control: FormControl) => {
      if (control.invalid) {
        control.markAsDirty()
        control.updateValueAndValidity({ onlySelf: true })
      }
      if (control['controls']) {
        control['controls'].forEach((element) =>
          Object.values(element.controls).forEach((control: any) => {
            if (control.invalid) {
              control.markAsDirty()
              control.updateValueAndValidity({ onlySelf: true })
            }
          })
        )
      }
    })
  }

  private transformJsonToObject = (url: string): Observable<CustomFormControl[]> => this.httpClient.get<CustomFormControl[]>(url)

  private createControls(data): FormGroup {
    data.forEach((form: CustomFormControl) =>
      this.formGroup.addControl(form.key, new FormControl(null, this.bindValidations(form.validations ?? [])))
    )
    return this.formGroup
  }

  private bindValidations(validations): ValidatorFn | null {
    if (!validations.length) {
      const compose = []
      validations.forEach((validator) => {
        switch (validator.name) {
          case 'required':
            compose.push(Validators.required)
            break
          case 'email':
            compose.push(Validators.email)
            break
          case 'maxlength':
            compose.push(Validators.maxLength(validator.value))
            break
          case 'minlength':
            compose.push(Validators.minLength(validator.value))
            break
          case 'max':
            compose.push(Validators.max(validator.value))
            break
          case 'min':
            compose.push(Validators.min(validator.value))
            break
          case 'pattern':
            compose.push(Validators.pattern(validator.value))
            break
        }
        compose.push(validator.validator)
      })
      return Validators.compose(compose)
    } else {
      return null
    }
  }
}
