import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ShiftService } from '../../services/shift.service'
import { map, switchMap } from 'rxjs'
import { getDateFromUnix, getTimeFromUnix } from '../../../../shared/utils/format-unix-time'

@Component({
    selector: 'app-shift-report',
    templateUrl: './shift-report.component.html',
    styleUrls: ['./shift-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ShiftReportComponent {

  constructor(
    private route: ActivatedRoute,
    private shiftService: ShiftService
  ) { }

  readonly getTimeFromUnix = getTimeFromUnix
  readonly getDateFromUnix = getDateFromUnix
  readonly shift = this.route.params.pipe(
    map(value => value['id']),
    switchMap(id => this.shiftService.getById(id)))

}