import { UserLanguageItem } from "./navbar.model"

export abstract class BootstrapConstants {
  static readonly locale = 'en'
  static readonly web = 'delicrm.web.app'
  static readonly currency = '$'
  static readonly titleFontSize = '30px'
  static readonly languageOptions: UserLanguageItem[] = [
    { value: 'en', title: 'English' },
    { value: 'es', title: 'Español' },
    // { value: 'pt', title: 'Português' },
    // { value: 'ru', title: 'Русский' }
  ]
}