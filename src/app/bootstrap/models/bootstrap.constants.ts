import { UserLanguageItem } from "./navbar.model"

export abstract class BootstrapConstants {
  static readonly locale = 'es'
  static readonly web = 'delicrm.web.app'
  static readonly currency = '$'
  static readonly titleFontSize = '10px'
  static readonly languageOptions: UserLanguageItem[] = [
    { value: 'en', title: 'English' },
    { value: 'es', title: 'Español' },
    // { value: 'pt', title: 'Português' },
    // { value: 'ru', title: 'Русский' }
  ]
}