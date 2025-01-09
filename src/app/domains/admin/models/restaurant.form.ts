import { FormControl, FormGroup, Validators } from "@angular/forms"

export enum RestaurantFormProps {
    name = 'name',
    address = 'address',
    description = 'description',
    phone = 'phone',
    web = 'web',
    currency = 'currency',
    delivery = 'delivery',
    discount = 'discount'
}

export const restaurantFormGroup = new FormGroup({
    [RestaurantFormProps.name]: new FormControl(null, Validators.required),
    [RestaurantFormProps.address]: new FormControl(null, Validators.required),
    [RestaurantFormProps.description]: new FormControl(null),
    [RestaurantFormProps.phone]: new FormControl(null, Validators.required),
    [RestaurantFormProps.web]: new FormControl(null, Validators.required),
    [RestaurantFormProps.currency]: new FormControl('$', Validators.required),
    [RestaurantFormProps.delivery]: new FormControl(0, Validators.required),
    [RestaurantFormProps.discount]: new FormControl(0, Validators.required),
})