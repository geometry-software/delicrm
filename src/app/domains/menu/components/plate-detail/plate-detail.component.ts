import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Recipe, RecipeProtein } from '../../../recipe/models/recipe.model'
import { setProteinImage } from '../../../../shared/utils/protein-image'

@Component({
  selector: 'app-plate-detail',
  templateUrl: './plate-detail.component.html',
  styleUrls: ['./plate-detail.component.scss'],
})
export class PlateDetailComponent implements OnInit {
  readonly plateDetail = 'Starter of the day. Side dishes of the day. Drink and dessert of the day.'
  plate: Recipe & { isRemoved: boolean }
  hasDeleteAuth: boolean

  constructor(public dialogRef: MatDialogRef<PlateDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  setProteinImage = setProteinImage

  ngOnInit() {
    console.log(this.data)

    this.plate = this.data.plate
  }

  addPlate() {
    this.dialogRef.close('add')
  }

  removeFromMenu() {
    this.dialogRef.close('remove')
  }
}
