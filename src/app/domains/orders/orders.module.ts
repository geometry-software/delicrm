import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { WaiterRoutingModule } from './orders-routing.module'
import { OrderListComponent } from './components/order-list/order-list.component'
import { OrderDetailComponent } from './components/order-detail/order-detail.component'
import { TranslateModule } from '@ngx-translate/core'
import { SharedModule } from '../../shared/shared.module'
import { AdminService } from '../admin/services/admin.service'
import { OrderService } from './services/order.service'

@NgModule({
  declarations: [OrderListComponent, OrderDetailComponent],
  imports: [RouterModule, CommonModule, SharedModule, ReactiveFormsModule, FormsModule, WaiterRoutingModule, TranslateModule],
  providers: [OrderService],
})
export class WaiterModule {}
