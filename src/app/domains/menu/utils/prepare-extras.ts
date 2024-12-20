import { cloneDeep } from "lodash";

export const prepareExtras = (menu: any) => {
    if (!menu) {
        return
    }
    const extra = cloneDeep(menu.extra)
    extra.drinks.push({ name: 'without drink', id: 'w/o' })
    extra.starters.push({ name: 'without starter', id: 'w/o' })
    return extra
}