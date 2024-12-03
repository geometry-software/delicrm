import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) { }

  userData
  userId: string
  isClient: boolean
  isEmployee: boolean
  clientData
  employeeData
  datasource = new MatTableDataSource()
  displayedColumns = ['date', 'price']
  clientForm: FormGroup
  isLoaded: boolean
  versionBuildDate: string = 'on the 1st of November 2024'

  ngOnInit() {
    this.initForm()
    this.getUserData()
  }

  getUserData() {
    // TODO
  }

  initForm() {
    this.clientForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      address: [null, [Validators.required]],
      phone: [null, [Validators.required]],
    })
  }

  updateClientData(form) {
    // TODO
  }

  updateRestaurantData(form) {
    // TODO
  }

  logout() {
    this.authService.logout()
  }

}