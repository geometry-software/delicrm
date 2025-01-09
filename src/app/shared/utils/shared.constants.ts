import { MatDialogConfig } from "@angular/material/dialog"

export abstract class SharedConstants {
  static readonly formComponentConfig: MatDialogConfig = {
    width: '80%',
    height: 'auto',
    maxWidth: '80vw',
    maxHeight: '80%'
  }
  static readonly tableLoadingOpacity = 0.3
}
