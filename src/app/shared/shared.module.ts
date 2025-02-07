import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MouseOnHoverDirective } from './services/mouse-on-hover.directive'
import { MaterialModule } from './design-system/material.module'
import { AppButtonComponent } from './components/app-button/app-button.component'
import { AppTableSearchComponent } from './components/app-table-search/app-table-search.component'
import { TranslateModule } from '@ngx-translate/core'
import { ToastrModule } from 'ngx-toastr';
import { AppConfirmationDialogComponent } from './components/app-confirmation-dialog/app-confirmation-dialog.component'
import { AppNotFoundComponent } from './components/app-not-found/app-not-found.component'
import { AppAddressComponent } from './components/app-address/app-address.component'
import { AppPaginationComponent } from './components/app-pagination/app-pagination.component'
import { AppTableLinkComponent } from './components/app-table-link/app-table-link.component'
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker'
import { AppFormattedDailyMenuComponent } from './components/app-formatted-daily-menu/app-formatted-daily-menu.component'
import { AppInfoComponent } from './components/app-info/app-info.component'
import { AppTitleComponent } from './components/app-title/app-title.component'
import { AppTitleItemComponent } from './components/app-title-item/app-title-item.component'
import { NotificationService } from './services/notification.service'
import { ConfirmationService } from './services/confirmation.service'
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask'
import { TabLabelPipe } from './pipes/tab-label.pipe'
import { AppSpinboxComponent } from './components/app-spinbox/app-spinbox.component'

@NgModule({
  declarations: [
    MouseOnHoverDirective,
    AppButtonComponent,
    AppTableSearchComponent,
    AppConfirmationDialogComponent,
    AppNotFoundComponent,
    AppAddressComponent,
    AppPaginationComponent,
    AppTableLinkComponent,
    AppInfoComponent,
    AppTitleComponent,
    AppTitleItemComponent,
    AppFormattedDailyMenuComponent,
    TabLabelPipe,
    AppSpinboxComponent
  ],
  exports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    CommonModule,
    ToastrModule,
    MouseOnHoverDirective,
    AppButtonComponent,
    AppTableSearchComponent,
    AppConfirmationDialogComponent,
    AppInfoComponent,
    AppTitleComponent,
    AppTitleItemComponent,
    AppNotFoundComponent,
    AppAddressComponent,
    AppPaginationComponent,
    AppTableLinkComponent,
    NgxMaterialTimepickerModule,
    AppFormattedDailyMenuComponent,
    TabLabelPipe,
    AppSpinboxComponent
  ],
  imports: [
    MaterialModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ToastrModule.forRoot(),
    NgxMaterialTimepickerModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    ConfirmationService,
    NotificationService,
    provideNgxMask()
  ]
})
export class SharedModule { }
