import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MatTableDataSource } from '@angular/material/table'
import { AdminService } from '../../services/admin.service'
import { SignalService } from '../../../../shared/services/signal.service'

@Component({
  selector: 'app-menu-detail',
  templateUrl: './menu-detail.component.html',
  styleUrls: ['./menu-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuDetailComponent implements OnInit {
  itemId: string
  item = {} as any
  datasource = new MatTableDataSource()
  displayedColumns = ['waiter', 'createdAt', 'price']

  isLoading: boolean
  isLoaded: boolean

  plateArray = new Array()
  starterArray = new Array()
  toppingsList = new Array()
  drinkArray = new Array()

  constructor(
    private router: Router,
    private adminService: AdminService,
    private signalService: SignalService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.initServerData()
  }

  initServerData() {
    this.itemId = this.route.snapshot.params['id']
    this.adminService.getDocument(this.itemId).subscribe((res: any) => {
      this.item = res
      this.plateArray = res.plates
      this.starterArray = res.starters.starterArray
      this.toppingsList = res.starters.toppingsList
      this.drinkArray = res.starters.drinkArray
      this.datasource = new MatTableDataSource(res.orders)
      this.isLoaded = true
    })

    /*
    this.isLoading = true
    this.daoHistory.getHistoryById(this.itemId).subscribe( res => {
      this.datasource = new MatTableDataSource(res)
      this.isLoading = false
    }) */
  }

  edit() {
    /*     this.navRouter.navigate(["create", this.itemId]).then( res => {
      this.SignalService.setNavbarTitle("Editar receta")
    }) */
  }

  redirect(path, name) {
    // this.navRouter.navigate([path]).then((res) => {
    //   this.SignalService.setNavbarTitle(name)
    // })
  }

  redirectToOrder(path, id, name) {
    // this.navRouter.navigate([path, id, "employee"]).then((res) => {
    //   this.SignalService.setNavbarTitle(name)
    // })
  }
}
