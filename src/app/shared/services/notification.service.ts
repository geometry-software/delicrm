import { Injectable } from '@angular/core'
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class NotificationService {

  constructor(
    private toastrService: ToastrService
  ) { }

  success(message: string, title: string = 'Success') {
    this.toastrService.success(message, title)
  }

  info(message: string, title: string = 'Info') {
    this.toastrService.info(message, title)
  }

  error(error: Error, title: string = 'Error') {
    console.error(error)
    this.toastrService.error(error.message, title)
  }

  warning(message: string, title: string = 'Warning') {
    this.toastrService.warning(message, title)
  }

}