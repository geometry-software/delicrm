import { DailyMenu, MenuItem } from "../models/restaurant"

export const calulatedMenuWithEightySix = (menu: DailyMenu, id: string) => {
    const updatedMain = menu.main.map(item => updateItemEightySix(item, id))
    // const updatedAlacarte = (menu.alacarte ?? []).map(item => this.updateItemEightySix(item, id))
    const updatedStarters = menu.extras.starters.map(item => updateItemEightySix(item, id))
    const updatedDrinks = menu.extras.drinks.map(item => updateItemEightySix(item, id))
    const updatedDesserts = menu.extras.desserts.map(item => updateItemEightySix(item, id))
    const updatedSideDishes = menu.extras.sideDishes.map(item => updateItemEightySix(item, id))
    const updatedMenu: DailyMenu = {
        ...menu,
        main: updatedMain,
        // alacarte: updatedAlacarte,
        extras: {
            drinks: updatedDrinks,
            starters: updatedStarters,
            sideDishes: updatedSideDishes,
            desserts: updatedDesserts
        }
    }
    return updatedMenu
}

const updateItemEightySix = (item: MenuItem, id: string) => {
    if (item.id === id) {
        item.eightySix = !item.eightySix
        return item
    } else {
        return item
    }
}