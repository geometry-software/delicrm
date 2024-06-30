import { LOCALE_ID, NgModule, isDevMode } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AngularFireModule } from '@angular/fire/compat'
import { AngularFireAuthModule } from '@angular/fire/compat/auth'
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CommonModule, registerLocaleData } from '@angular/common'
import localeDeAt from '@angular/common/locales/es'
import { AppRoutingModule, routes } from './app-routing.module'
import { AppComponent } from './app.component'
import { firebaseConfig } from './utils/firebase.config'
import { AngularFireStorageModule } from '@angular/fire/compat/storage'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NavbarComponent } from './components/navbar/navbar.component'
import { IndexComponent } from './components/index/index.component'
import { ServiceWorkerModule } from '@angular/service-worker'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { SharedModule } from '../shared/shared.module'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'

registerLocaleData(localeDeAt)
const httpLoaderFactory = (http: HttpClient) => new TranslateHttpLoader(http)

@NgModule({ declarations: [AppComponent, NavbarComponent, IndexComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFirestoreModule,
        AngularFireStorageModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),
        SharedModule,
        StoreModule.forRoot(),
        EffectsModule.forRoot(),
        StoreDevtoolsModule.instrument()], providers: [
        {
            provide: LOCALE_ID,
            useValue: 'en',
        },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}
