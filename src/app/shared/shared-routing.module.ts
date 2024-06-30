import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AppInfoComponent } from '../auth/components/app-info/app-info.component'

export const ROUTES: Routes = [{ path: 'app-info', component: AppInfoComponent, canActivate: [] }]

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
