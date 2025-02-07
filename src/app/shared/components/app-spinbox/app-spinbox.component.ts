import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-spinbox',
  templateUrl: './app-spinbox.component.html',
  styleUrl: './app-spinbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppSpinboxComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppSpinboxComponent implements ControlValueAccessor {

  value: number = 0
  onChange: any = () => { }
  onTouched: any = () => { }

  @Input()
  label: string

  writeValue(value: number): void {
    this.value = value
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  increment() {
    this.value++
    this.onChange(this.value)
  }

  decrement() {
    this.value--
    this.onChange(this.value)
  }

  onInput(event: Event) {
    this.value = Number((event.target as HTMLInputElement).value)
    this.onChange(this.value)
  }

}