import { FormControl, FormGroup, Validators } from "@angular/forms";

export enum RecipeFormProps {
    name = 'name',
    type = 'type',
    protein = 'protein',
    description = 'description',
    imgURL = 'imgURL',
    price = 'price'
}

export const recipeFormGroup = new FormGroup({
    [RecipeFormProps.name]: new FormControl(null, Validators.required),
    [RecipeFormProps.type]: new FormControl(null, Validators.required),
    [RecipeFormProps.protein]: new FormControl(null),
    [RecipeFormProps.description]: new FormControl(null),
    [RecipeFormProps.imgURL]: new FormControl(null),
    [RecipeFormProps.price]: new FormControl(null),
})