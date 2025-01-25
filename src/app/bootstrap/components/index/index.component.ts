import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import * as moment from 'moment'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexComponent implements OnInit {
  today = moment(new Date()).locale('es').format('DD MMMM')

  imageIndex = 0

  constructor(private router: Router) { }

  ngOnInit() {
    this.carousel()
    setInterval(() => {
      this.carousel()
    }, 3000)
  }

  carousel() {
    let i, x = document.getElementsByClassName('mySlides') as HTMLCollectionOf<any>
    if (x.length > 0) {
      for (i = 0; i < x.length; i++) {
        x[i].style.display = 'none'
      }
      this.imageIndex++
      if (this.imageIndex > x.length) {
        this.imageIndex = 1
      }
      x[this.imageIndex - 1].style.display = 'block'
    }
  }

}