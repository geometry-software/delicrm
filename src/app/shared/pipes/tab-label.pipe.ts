import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TabLabel } from '../models/shared.model';

@Pipe({
    name: 'tabLabel',
    pure: false,
    standalone: false
})
export class TabLabelPipe implements PipeTransform {

    constructor(
        private translateService: TranslateService,
    ) { }

    transform(tabLabel: TabLabel) {
        return this.translateService.instant(tabLabel.title) + ' (' + tabLabel.amount + ')'
    }

}