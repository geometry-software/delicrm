import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Recipe, RecipeProtein } from '../../../recipe/models/recipe.model'
import { setProteinImage } from '../../../../shared/utils/protein-image'
import { MenuItem } from '../../../admin/models/restaurant'
import { Observable } from 'rxjs'
import { User } from '../../../users/models/user.model'

@Component({
  selector: 'app-plate-detail',
  templateUrl: './plate-detail.component.html',
  styleUrls: ['./plate-detail.component.scss'],
})
export class PlateDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PlateDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  readonly setProteinImage = setProteinImage

  plate: MenuItem
  currency: Observable<string>
  user: Observable<User>
  hasDeleteAuth: boolean

  ngOnInit() {
    this.plate = this.data.plate
    this.currency = this.data.currency
    this.user = this.data.user
    this.user.pipe(

    ).subscribe(value => this.hasDeleteAuth = Boolean(value))
  }

  addPlate() {
    this.dialogRef.close('add')
  }

  removePlate() {
    this.dialogRef.close('remove')
  }

  returnPlate() {
    this.dialogRef.close('remove')
  }

  getPlateWithImage(item: Recipe) {
    return item.type === 'alacarte' || item.type === 'main'
  }

}