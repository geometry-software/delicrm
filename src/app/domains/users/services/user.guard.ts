import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class UserGuard {
  constructor() { }

  canActivate() {
    return true
  }
}
