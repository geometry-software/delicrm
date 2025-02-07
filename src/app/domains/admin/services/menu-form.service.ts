import { Injectable } from '@angular/core'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { DailyMenu, Restaurant } from '../models/restaurant'
import { RestaurantConstants } from '../models/restaurant.constants'
import { EMPTY, Observable, map, switchMap } from 'rxjs'
import { Shift } from '../models/shift'
import { CheckoutOrder } from '../../menu/models/checkout'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

@Injectable({
  providedIn: 'root'
})
export class MenuFormService {

  constructor(
    private formBuilder: FormBuilder
  ) { }

  menuForm: FormGroup
  plateForm: FormGroup

  initForm(startersAmount: number, drinksAmount: number, sideDishesAmount: number) {
    this.menuForm = this.formBuilder.group({
      starters: this.initFormArrayItem(startersAmount),
      drinks: this.initFormArrayItem(drinksAmount),
      sideDishes: this.initFormArrayItem(sideDishesAmount),
    })
    this.plateForm = this.formBuilder.group({})
  }

  getStarters() {
    return this.menuForm.get('starters') as FormArray
  }

  getDrinks() {
    return this.menuForm.get('drinks') as FormArray
  }

  getSideDishes() {
    return this.menuForm.get('sideDishes') as FormArray
  }

  private initFormArrayItem(amount: number) {
    const array: FormArray = this.formBuilder.array([])
    for (let i = 0; i < amount; i++) {
      array.push(new FormControl(null, Validators.required))
    }
    return array
  }

}