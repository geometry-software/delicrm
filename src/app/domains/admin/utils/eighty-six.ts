import { DailyMenu, MenuItem } from "../models/restaurant"

export const calulatedDailyMenuWithEightySix = (menu: DailyMenu, id: string): DailyMenu => {
    const updatedMain = menu.main.map(item => updateItemEightySix(item, id))
    const updatedStarters = menu.extras.starters.map(item => updateItemEightySix(item, id))
    const updatedDrinks = menu.extras.drinks.map(item => updateItemEightySix(item, id))
    const updatedDesserts = menu.extras.desserts.map(item => updateItemEightySix(item, id))
    const updatedSideDishes = menu.extras.sideDishes.map(item => updateItemEightySix(item, id))
    return {
        ...menu,
        main: updatedMain,
        extras: {
            drinks: updatedDrinks,
            starters: updatedStarters,
            sideDishes: updatedSideDishes,
            desserts: updatedDesserts
        }
    }
}

export const calulatedAlacarteMenuWithEightySix = (alacarte: MenuItem[], id: string): MenuItem[] =>
    alacarte.map(item => updateItemEightySix(item, id))

const updateItemEightySix = (item: MenuItem, id: string) => {
    if (item.id === id) {
        item.eightySix = !item.eightySix
        return item
    } else {
        return item
    }
}