import { Injectable, computed, signal } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class SignalService {
  userData = signal(null)
  setUserData = (data): void => this.userData.set(data)
  getUserData = computed(() => this.userData())

  toolbarTitle = signal(null)
  setToolbarTitle = (data) => setTimeout(() => this.toolbarTitle.set(data))
  getToolbarTitle = computed(() => this.toolbarTitle())

  layoutType = signal(null)
  setLayoutType = (data) => this.layoutType.set(data)
  getLayoutType = computed(() => this.layoutType())
}
