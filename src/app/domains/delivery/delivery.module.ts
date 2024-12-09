import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { DeliveryRoutingModule } from './delivery-routing.module'
import { DeliveryListComponent } from './components/delivery-list/delivery-list.component'
import { TranslateModule } from '@ngx-translate/core'
import { SharedModule } from '../../shared/shared.module'
import { DeliveryDetailComponent } from './components/delivery-detail/delivery-detail.component'
import { DeliveryService } from './services/delivery.service'

@NgModule({
  declarations: [DeliveryDetailComponent, DeliveryListComponent],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    DeliveryRoutingModule,
    TranslateModule,
  ],
  providers: [DeliveryService],
})
export class DeliveryModule { }
