import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-table-search',
  templateUrl: './app-table-search.component.html',
  styleUrls: ['./app-table-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTableSearchComponent {
  @Input()
  url: string
  @Input()
  placeholder: string = 'MISC.SEARCH_PLACEHOLDER'
  @Input()
  formControl: FormControl

  constructor() { }

  getUrl = (): string => `{'/' + this.url + '/create'}`
}
