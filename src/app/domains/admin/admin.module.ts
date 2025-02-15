import { NgModule } from '@angular/core'
import { AdminRoutingModule } from './admin-routing.module'
import { MenuFormComponent } from './components/menu-form/menu-form.component'
import { ReportsComponent } from './components/reports/reports.component'
import { SharedModule } from '../../shared/shared.module'
import { BoardLayoutComponent } from './components/board-layout/board-layout.component'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { AdminConstants } from './models/admin.constants'
import { AdminEffects } from './store/admin-store/admin.effects'
import { reducer } from './store/admin-store/admin.reducer'
import { ImageMenuComponent } from './components/image-menu/image-menu.component'
import { ShiftEffects } from './store/shift-store/shift.effects'
import { ShiftConstants } from './models/shift.constants'
import { shiftReducer } from './store/shift-store/shift.reducer'
import { ShiftService } from './services/shift.service'
import { ShiftReportComponent } from './components/shift-report/shift-report.component'
import { MenuFormService } from './services/menu-form.service'
import { AlacarteMenuComponent } from './components/alacarte-menu/alacarte-menu.component'
import { RequiredAutocompleteDirective } from '../../shared/directives/required-autocomplete.directive'

@NgModule({
  declarations: [
    BoardLayoutComponent,
    MenuFormComponent,
    ImageMenuComponent,
    ReportsComponent,
    ShiftReportComponent,
    AlacarteMenuComponent,
    // RequiredAutocompleteDirective,
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    StoreModule.forFeature(AdminConstants.storeFeatureKey, reducer),
    StoreModule.forFeature(ShiftConstants.storeFeatureKey, shiftReducer),
    EffectsModule.forFeature([AdminEffects, ShiftEffects]),
  ],
  providers: [
    MenuFormService,
    ShiftService
  ]
})
export class AdminModule { }