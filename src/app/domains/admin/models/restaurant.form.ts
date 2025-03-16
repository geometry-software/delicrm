import { FormControl, FormGroup, Validators } from "@angular/forms"
import { BootstrapConstants } from "../../../bootstrap/models/bootstrap.constants"
// import { BootstrapConstants } from "../../../bootstrap/utils/bootstrap.constants"

export enum RestaurantFormProps {
    name = 'name',
    description = 'description',
    contact = 'contact',
    address = 'address',
    phone = 'phone',
    web = 'web',
    locale = 'locale',
    titleFontSize = 'titleFontSize',
    // drinksAmount = 'drinksAmount',
    // sideDishesAmount = 'sideDishesAmount',
    // openTime = 'openTime',
    currency = 'currency',
    delivery = 'delivery',
    closedTitle = 'closedTitle',
    // discount = 'discount'
}

export const restaurantFormGroup = new FormGroup({
    [RestaurantFormProps.name]: new FormControl(null, Validators.required),
    [RestaurantFormProps.description]: new FormControl(null),
    [RestaurantFormProps.contact]: new FormControl(null, Validators.required),
    [RestaurantFormProps.address]: new FormControl(null, Validators.required),
    [RestaurantFormProps.phone]: new FormControl(null, Validators.required),
    [RestaurantFormProps.web]: new FormControl(null, Validators.required),
    [RestaurantFormProps.locale]: new FormControl(null, Validators.required),
    [RestaurantFormProps.closedTitle]: new FormControl(null, Validators.required),
    [RestaurantFormProps.titleFontSize]: new FormControl(BootstrapConstants.titleFontSize, Validators.required),
    // [RestaurantFormProps.startersAmount]: new FormControl(null, Validators.required),
    // [RestaurantFormProps.drinksAmount]: new FormControl(null, Validators.required),
    // [RestaurantFormProps.sideDishesAmount]: new FormControl(null, Validators.required),
    // [RestaurantFormProps.openTime]: new FormControl(null, Validators.required),
    [RestaurantFormProps.currency]: new FormControl(BootstrapConstants.currency, Validators.required),
    [RestaurantFormProps.delivery]: new FormControl(0, Validators.required),
    // [RestaurantFormProps.discount]: new FormControl(0, Validators.required),
})