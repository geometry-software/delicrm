import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ClientsComponent } from './components/clients/clients.component'
// import { ClientsLayoutComponent } from './components/clients-layout/clients-layout.component'
import { AppInfoComponent } from '../../shared/components/app-info/app-info.component'
import { ClientFormComponent } from './components/client-form/client-form.component'
// import { ClientDetailComponent } from './components/client-detail/client-detail.component'

const routes: Routes = [
  {
    path: '',
    component: ClientsComponent,
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ClientsRoutingModule { }
