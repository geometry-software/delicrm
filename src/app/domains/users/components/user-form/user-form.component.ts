import { Component } from '@angular/core'
import { filter, map, switchMap, tap } from 'rxjs'
import { Store } from '@ngrx/store'
import { getItemById, getLoadingStatus } from '../../store/user.selectors'
import { ActivatedRoute, Router } from '@angular/router'
import { UserActions } from '../../store/user.actions'
import { highlightInvalidFields, showFieldErrors } from '../../../../shared/utils/form-error-handling'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { getDateFromUnix } from '../../../../shared/utils/format-unix-time'
import { LoadingStatus } from '../../../../shared/models/loading-status'

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent {

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  readonly showFieldErrors = showFieldErrors
  readonly getDateFromUnix = getDateFromUnix
  readonly form = new FormGroup({
    name: new FormControl(null, Validators.required),
  })
  itemId: string
  readonly loading = this.store.select(getLoadingStatus)
  readonly LoadingStatus = LoadingStatus

  user = this.route.params.pipe(
    map(value => value['id']),
    switchMap(id => this.store.select(getItemById(id)).pipe(
      tap(value => {
        if (!value) {
          this.router.navigate(['users'])
        } else {
          this.form.controls.name.patchValue(value.name)
          this.itemId = value.userId
        }
      })))
  )

  confirm() {
    if (this.form.valid && this.itemId) {
      this.store.dispatch(UserActions.updateUserName({ name: this.form.value.name, id: this.itemId }))
    } else {
      highlightInvalidFields(this.form)
    }
  }

}