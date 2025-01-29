import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class NotificationService {

  private successTitle = 'NOTIFICATION.SUCCESS'
  private infoTitle = 'NOTIFICATION.INFO'
  private errorTitle = 'NOTIFICATION.ERROR'
  private warningTitle = 'NOTIFICATION.WARNING'

  constructor(
    private toastrService: ToastrService,
    private translateService: TranslateService,
  ) { }

  success(message: string, title: string = this.successTitle) {
    this.toastrService.success(this.translate(message), this.translate(title))
  }

  info(message: string, title: string = this.infoTitle) {
    this.toastrService.info(this.translate(message), this.translate(title))
  }

  error(error: Error, title: string = this.errorTitle) {
    console.error(error)
    this.toastrService.error(error.message, this.translate(title))
  }

  warning(message: string, title: string = this.warningTitle) {
    this.toastrService.warning(this.translate(message), this.translate(title))
  }

  private translate(message: string) {
    return this.translateService.instant(message)
  }

}