import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Store } from '@ngrx/store'
import { PLATE_PROTEIN_TRANSLATE, PLATE_TYPE_TRANSLATE } from '../../models/recipe.constants'
import { getItem, } from '../../store/recipe.selectors'
import { map, switchMap } from 'rxjs'
import { SignalService } from '../../../../shared/services/signal.service'

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeDetailComponent implements OnInit {

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private signalService: SignalService) { }

  readonly plateTypeTranslate = PLATE_TYPE_TRANSLATE
  readonly plateProteinTranslate = PLATE_PROTEIN_TRANSLATE
  readonly item = this.route.params.pipe(
    map(value => value['id']),
    switchMap(id => this.store.select(getItem(id)))
  )

  ngOnInit() {
    this.setSignals()
  }

  setSignals() {
    this.signalService.setToolbarTitle(this.route.snapshot.data['title'])
    this.signalService.setLayoutType(this.route.snapshot.data['type'])
  }

}