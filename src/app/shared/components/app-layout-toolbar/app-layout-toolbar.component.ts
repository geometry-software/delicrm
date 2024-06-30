import { Component, EventEmitter, Input, Output, Signal, inject } from '@angular/core'
import { FormControl } from '@angular/forms'
import { SignalService } from '../../services/signal.service'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-layout-toolbar',
  templateUrl: './app-layout-toolbar.component.html',
  styleUrls: ['./app-layout-toolbar.component.scss'],
})
export class AppLayoutToolbarComponent {
  readonly layoutTypeSignal: Signal<string> = inject(SignalService).getLayoutType

  @Input()
  isLoading$: Observable<boolean>
  @Input()
  url: string
  @Input()
  placeUrl: string = ''
  @Input()
  backTitle: string
  @Input()
  id: string
  @Input()
  backToListButton: string
  @Input()
  searchPlaceholder: string = 'MISC.SEARCH_PLACEHOLDER'
  @Input()
  searchControl: FormControl
  @Output()
  deleteItem = new EventEmitter()

  getCreateUrl = (): string => `${'/' + this.url + '/create'}`
  getEditUrl = (): string => this.url + '/' + this.id + '/edit/'
  getPlaceUrl = (): string => this.url + '/' + this.placeUrl
  getPlaceEditUrl = (): string => this.url + '/' + this.placeUrl + '/' + this.id + '/edit/'

  ngOnChanges(c) {
    // console.log(c)
  }
}
