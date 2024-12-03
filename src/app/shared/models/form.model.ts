import { FormGroup } from '@angular/forms'

export interface LoadState<T> {
  loading: boolean
  loaded?: T | boolean
  error: Error
}

export interface ModalData<T> {
  item: T
  type: FormType
}

export enum FormInitialization {
  CLEAR = 'CLEAR',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  RESET = 'RESET',
  ERROR = 'ERROR',
}

export enum FormType {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
}

export enum FormAction {
  ADD = 'Add',
  EDIT = 'Edit',
}

export interface FormControlValidator {
  name: string
  message: string
  value: number
}

export interface FormLayout<T> {
  formControls: Array<CustomFormControl>
  formGroup: FormGroup
  formData?: T
}

export interface CustomFormControl {
  key: string
  type: string
  label: string
  placeholder: string
  validations: Array<FormControlValidator>
  mask: FormControlMask
  options: Array<string>
}

export interface FormControlMask {
  type: string
  pattern: string
}
