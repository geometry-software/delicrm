import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { registerLocaleData } from '@angular/common'
import localeDeAt from '@angular/common/locales/es'
import { HttpClient } from '@angular/common/http'

registerLocaleData(localeDeAt)
export const httpLoaderFactory = (http: HttpClient) => new TranslateHttpLoader(http)
