import { Component } from '@angular/core'
import { filter, map, switchMap, tap } from 'rxjs'
import { Store } from '@ngrx/store'
import { getItemById, getLoadingStatus } from '../../store/client.selectors'
import { ActivatedRoute, Router } from '@angular/router'
import { ClientActions } from '../../store/client.actions'
import { highlightInvalidFields, showFieldErrors } from '../../../../shared/utils/form-error-handling'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { getDateFromUnix } from '../../../../shared/utils/format-unix-time'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { Auth } from '../../../../auth/models/auth.model'

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
})
export class ClientFormComponent {

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  readonly showFieldErrors = showFieldErrors
  readonly getDateFromUnix = getDateFromUnix
  readonly form = new FormGroup({
    name: new FormControl(null, Validators.required),
    address: new FormControl(null, Validators.required),
    phone: new FormControl(null, Validators.required),
  })
  itemId: string
  readonly loading = this.store.select(getLoadingStatus)
  readonly LoadingStatus = LoadingStatus

  client = this.route.params.pipe(
    map(value => value['id']),
    switchMap(id => this.store.select(getItemById(id)).pipe(
      tap(value => this.initItem(value)))))

  initItem(auth: Auth) {
    if (!auth) {
      this.router.navigate(['clients'])
    } else {
      this.form.patchValue(auth)
      this.itemId = auth.authId
    }
  }

  confirm() {
    if (this.form.valid && this.itemId) {
      this.store.dispatch(ClientActions.updateClient({
        id: this.itemId,
        name: this.form.value.name,
        address: this.form.value.address,
        phone: this.form.value.phone,
      }))
    } else {
      highlightInvalidFields(this.form)
    }
  }

}