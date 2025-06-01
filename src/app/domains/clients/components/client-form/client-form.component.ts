import { Component, DestroyRef, Inject, OnInit } from '@angular/core'
import { filter } from 'rxjs'
import { Store } from '@ngrx/store'
import { getDeliveries } from '../../store/client.selectors'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { Router } from '@angular/router'
import { ClientActions } from '../../store/client.actions'
import { highlightInvalidFields, showFieldErrors } from '../../../../shared/utils/form-error-handling'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { getFullTimeFromUnix } from '../../../../shared/utils/format-unix-time'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { Auth } from '../../../../auth/models/auth.model'
import { SharedModule } from '../../../../shared/shared.module'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SignalService } from '../../../../shared/services/signal.service'
import { MenuActions } from '../../../menu/store/menu.actions'
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'app-client-form',
    templateUrl: './client-form.component.html',
    styleUrls: ['./client-form.component.scss'],
    imports: [SharedModule]
})
export class ClientFormComponent implements OnInit {

  constructor(
    private store: Store,
    private dialogRef: MatDialogRef<ClientFormComponent>,
    private destroyRef: DestroyRef,
    private signalService: SignalService,
    private router: Router,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public dialogData: Auth
  ) { }

  ngOnInit(): void {
    this.itemId = this.dialogData?.authId
    if (this.itemId) {
      this.form.patchValue(this.dialogData)
    }
    this.onCloseAfterConfirm()
  }

  readonly loadingStatus = toObservable(this.signalService.getClientLoadingStatus)
  readonly deliveriesLoadingStatus = toObservable(this.signalService.loadingStatus)
  readonly showFieldErrors = showFieldErrors
  readonly getFullTimeFromUnix = getFullTimeFromUnix
  readonly form = new FormGroup({
    name: new FormControl(null, Validators.required),
    address: new FormControl(null, Validators.required),
    phone: new FormControl(null, Validators.required),
  })
  readonly LoadingStatus = LoadingStatus
  readonly deliveries = this.store.select(getDeliveries)
  itemId: string

  confirm() {
    if (this.form.valid) {
      if (this.itemId) {
        this.store.dispatch(ClientActions.updateClient({
          id: this.itemId,
          name: this.form.value.name,
          address: this.form.value.address,
          phone: this.form.value.phone,
        }))
      } else {
        this.store.dispatch(MenuActions.createClient({
          name: this.form.value.name,
          address: this.form.value.address,
          phone: this.form.value.phone,
        }))
      }
    } else {
      highlightInvalidFields(this.form)
    }
  }

  onCloseAfterConfirm() {
    this.loadingStatus.pipe(
      filter(value => value === LoadingStatus.Loaded),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.close())
  }

  close() {
    this.store.dispatch(ClientActions.resetClientForm())
    this.dialogRef.close()
  }

  showDeliveries() {
    this.store.dispatch(ClientActions.getDeliveries({ id: this.itemId }))
  }

  redirectToDelivery(id: string) {
    this.router.navigate(['/delivery', id]).then(() => {
      this.store.dispatch(ClientActions.resetClientForm())
      this.dialogRef.close()
    })
  }

  getButtonTitle(status: LoadingStatus) {
    return status === LoadingStatus.Loading
      ? 'CLIENTS.MODAL.BUTTON.ACTION'
      : this.dialogData
        ? 'CLIENTS.MODAL.BUTTON.UPDATE'
        : 'CLIENTS.MODAL.BUTTON.CREATE'
  }

  getCreatedByTitle(client: Auth) {
    return client.createdByUserName
      ? client.createdByUserName
      : this.translateService.instant('CLIENTS.CREATED_BY_CLIENT.YES')
  }

}