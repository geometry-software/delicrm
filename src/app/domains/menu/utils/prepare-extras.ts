import { cloneDeep } from "lodash";
import { DailyMenu } from "../../admin/models/restaurant";

export const prepareExtras = (menu: DailyMenu) => {
    if (!menu) {
        return null
    }
    const extras = cloneDeep(menu.extras)
    extras?.drinks.push({ skippedTitle: 'MENU.CHECKOUT.SKIP.DRINK', isSkipped: true })
    extras?.starters.push({ skippedTitle: 'MENU.CHECKOUT.SKIP.STARTER', isSkipped: true })
    return extras
}