import { Component, EventEmitter, Input, Output, Signal, inject } from '@angular/core'
import { FormControl } from '@angular/forms'
import { SignalService } from '../../../../shared/services/signal.service'
import { Observable } from 'rxjs'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { Recipe } from '../../models/recipe.model'
import { RecipeConstants } from '../../models/recipe.constants'

@Component({
  selector: 'app-recipe-toolbar',
  templateUrl: './recipe-toolbar.component.html',
  styleUrls: ['./recipe-toolbar.component.scss'],
})
export class RecipeToolbarComponent {

  readonly layoutTypeSignal: Signal<string> = inject(SignalService).getLayoutType
  readonly LoadingStatus = LoadingStatus
  readonly url = RecipeConstants.moduleUrl
  readonly searchPlaceholder: string = 'MISC.SEARCH_PLACEHOLDER'

  @Input()
  item: Recipe

  @Input()
  searchControl: FormControl

  @Output()
  deleteItem = new EventEmitter()

  getCreateUrl = () => `${'/' + this.url + '/create'}`

  getPlaceUrl = () => this.url

  deleteRecipe() {
    this.deleteItem.emit(this.item.id)
  }

}
