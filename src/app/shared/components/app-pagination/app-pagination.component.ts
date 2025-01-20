import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { PaginationRequest, PaginationResponse } from '../../models/pagination.model'
import { RepositoryRequestListQuery } from '../../repository/repository.models'
import { LoadingStatus } from '../../models/loading-status'

@Component({
  selector: 'app-pagination',
  templateUrl: './app-pagination.component.html',
  styleUrls: ['./app-pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppPaginationComponent implements OnInit {
  @Input()
  paginationControl: FormControl<PaginationRequest<any>>
  @Input()
  sizeControl: FormControl<number>
  @Input()
  paginationPayload: PaginationResponse<any>
  @Input()
  loadingStatus: LoadingStatus
  size: number

  ngOnInit(): void {
    this.size = this.sizeControl.value
  }

  changeSize(size) {
    this.sizeControl.setValue(size)
  }

  changePage(query: RepositoryRequestListQuery) {
    let item
    switch (query) {
      case 'first':
        item = null
        break
      case 'next':
        item = this.paginationPayload.item.last
        break
      case 'previous':
        item = this.paginationPayload.item.first
        break
    }
    this.paginationControl.setValue({
      query: query,
      item: item,
    })
  }

  disablePrevious() {
    return this.paginationControl.value.query === 'custom' ||
      this.sizeControl.value === this.paginationPayload.options.current ||
      this.loadingStatus === LoadingStatus.Loading
  }

  disableNext() {
    return this.paginationControl.value.query === 'custom'
      ? true
      : this.paginationPayload.options.current === this.paginationPayload.options.total ||
      this.loadingStatus === LoadingStatus.Loading
  }

  disableOnLoading() {
    return this.loadingStatus === LoadingStatus.Loading
  }

}