import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { FormControl } from '@angular/forms'
import { switchMap } from 'rxjs'

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppButtonComponent {
  @Input()
  title: string
  @Input()
  icon: string
  @Input()
  url: string
  @Input()
  disabled: boolean
  @Input()
  actionType: string = 'back'
  @Input()
  type: string = 'button'
  @Input()
  width: 'full'
  @Input()
  background: string
  @Output()
  submit = new EventEmitter()

  constructor() { }

  q = new FormControl()

  qq() {

  }
}
