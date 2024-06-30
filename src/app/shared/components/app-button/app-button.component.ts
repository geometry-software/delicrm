import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'

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
  width: string
  @Input()
  background: string
  @Output()
  submit = new EventEmitter()

  constructor() {}
}
