import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
  selector: 'app-save-button',
  templateUrl: './app-save-button.component.html',
  styleUrls: ['./app-save-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSaveButtonComponent {
  @Input()
  form: FormGroup
  @Input()
  loading: boolean
  @Output()
  submit = new EventEmitter()
}
