import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AppInfoComponent } from './components/app-info/app-info.component'

export const routes: Routes = [{ path: 'app-info', component: AppInfoComponent, canActivate: [] }]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
