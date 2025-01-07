import { cloneDeep } from "lodash";

export const prepareExtras = (menu) => {
    if (!menu) {
        return
    }
    const extras = cloneDeep(menu.extras)
    extras.drinks.push({ name: 'without drink', id: 'w/o' })
    extras.starters.push({ name: 'without starter', id: 'w/o' })
    return extras
}