import { Component, DestroyRef, Inject, NgZone, OnInit } from '@angular/core'
import { distinctUntilChanged, filter, first, map, switchMap, tap } from 'rxjs'
import { Store } from '@ngrx/store'
import { getItemId, getLoadingStatus } from '../../store/client.selectors'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router } from '@angular/router'
import { ClientActions } from '../../store/client.actions'
import { highlightInvalidFields, showFieldErrors } from '../../../../shared/utils/form-error-handling'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { getDateFromUnix } from '../../../../shared/utils/format-unix-time'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { Auth } from '../../../../auth/models/auth.model'
import { SharedModule } from '../../../../shared/shared.module'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SessionService } from '../../../../auth/services/session.service'
import { SignalService } from '../../../../shared/services/signal.service'
import { MenuActions } from '../../../menu/store/menu.actions'

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class ClientFormComponent implements OnInit {

  constructor(
    private store: Store,
    private dialogRef: MatDialogRef<ClientFormComponent>,
    private destroyRef: DestroyRef,
    private signalService: SignalService,
    @Inject(MAT_DIALOG_DATA) public dialogData: Auth
  ) { }

  ngOnInit(): void {
    this.client = this.dialogData
    this.itemId = this.dialogData?.authId
    if (this.itemId) {
      this.form.patchValue(this.dialogData)
    }
    this.onCloseAfterConfirm()
  }

  readonly loadingStatus = toObservable(this.signalService.getClientLoadingStatus)
  readonly showFieldErrors = showFieldErrors
  readonly getDateFromUnix = getDateFromUnix
  readonly form = new FormGroup({
    name: new FormControl(null, Validators.required),
    address: new FormControl(null, Validators.required),
    phone: new FormControl(null, Validators.required),
  })
  readonly LoadingStatus = LoadingStatus
  client: Auth
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
    this.signalService.setClientLoadingStatus(LoadingStatus.NotLoaded)
    this.dialogRef.close()
  }

  getButtonTitle(status: LoadingStatus) {
    return status === LoadingStatus.Loading
      ? 'CLIENTS.MODAL.BUTTON.ACTION'
      : this.dialogData
        ? 'CLIENTS.MODAL.BUTTON.UPDATE'
        : 'CLIENTS.MODAL.BUTTON.CREATE'
  }

}