import { Injectable } from '@angular/core'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { DailyMenu, Extras, ExtrasAmount, MenuItem, Restaurant } from '../models/restaurant'
import { RestaurantConstants } from '../models/restaurant.constants'
import { BehaviorSubject, EMPTY, Observable, map, switchMap } from 'rxjs'
import { Shift } from '../models/shift'
import { CheckoutOrder } from '../../menu/models/checkout'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Recipe } from '../../recipe/models/recipe.model'

@Injectable({
  providedIn: 'root'
})
export class MenuFormService {

  constructor(
    private formBuilder: FormBuilder
  ) { }

  private plateList: Array<MenuItem> = []
  private chosenPlates: Array<MenuItem> = []
  private menu: DailyMenu
  private plateListSub = new BehaviorSubject<Array<MenuItem>>([])
  private chosenPlatesSub = new BehaviorSubject<Array<MenuItem>>([])
  private extrasAmountSub = new BehaviorSubject<ExtrasAmount>(null)
  extrasForm: FormGroup
  platesForm: FormGroup

  initForm(menu: DailyMenu, recipes: Recipe[]) {
    this.extrasForm = this.formBuilder.group({
      starters: this.initFormArrayItem(menu.extrasAmount.starters),
      drinks: this.initFormArrayItem(menu.extrasAmount.drinks),
      sideDishes: this.initFormArrayItem(menu.extrasAmount.sideDishes),
      desserts: this.initFormArrayItem(menu.extrasAmount.desserts),
    })
    this.menu = menu
    this.platesForm = this.formBuilder.group({})
    this.plateList = recipes.filter(value => value.type == 'main')
    this.plateListSub.next(this.plateList)
    this.extrasAmountSub.next(menu.extrasAmount)
  }

  getStarters() {
    return this.extrasForm.get('starters') as FormArray
  }

  getDrinks() {
    return this.extrasForm.get('drinks') as FormArray
  }

  getSideDishes() {
    return this.extrasForm.get('sideDishes') as FormArray
  }

  getDesserts() {
    return this.extrasForm.get('desserts') as FormArray
  }

  getMainPlates() {
    return this.plateListSub.asObservable()
  }

  getChosenPlates() {
    return this.chosenPlatesSub.asObservable()
  }

  getExtrasAmount() {
    return this.extrasAmountSub.asObservable()
  }

  resetChosenPlates() {
    const list = this.plateList.map(el => ({ ...el, isAdded: false }))
    this.plateListSub.next(list)
    this.chosenPlates = []
    this.chosenPlatesSub.next([])
    this.extrasForm.markAsPristine()
    this.platesForm.reset()
    this.platesForm.markAsPristine()
  }

  patchForms() {
    for (let index = 0; index < this.menu.main.length; index++) {
      const item = this.menu.main[index]
      this.chosenPlates.push({ ...item, isAdded: true })
    }
    this.chosenPlates.forEach(el => {
      const item = this.plateList.find(plate => plate.id === el.id)
      const index = this.plateList.indexOf(item)
      this.plateList[index] = { ...item, isAdded: true }
    })
    this.chosenPlatesSub.next(this.chosenPlates)
    this.plateListSub.next(this.plateList)
    this.getStarters().patchValue(this.menu.extras.starters)
    this.getDrinks().patchValue(this.menu.extras.drinks)
    this.getSideDishes().patchValue(this.menu.extras.sideDishes)
    this.getDesserts().patchValue(this.menu.extras.desserts)
  }

  private initFormArrayItem(amount: number) {
    const array: FormArray = this.formBuilder.array([])
    for (let i = 0; i < amount; i++) {
      array.push(new FormControl(null, Validators.required))
    }
    return array
  }

}