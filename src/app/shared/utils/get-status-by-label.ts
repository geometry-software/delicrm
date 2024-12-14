import { MatTabChangeEvent } from "@angular/material/tabs"

export const getStatusByLabel = <S>(event: MatTabChangeEvent) => {
    let labelAmount = event.tab.textLabel.split('(').pop().slice(0, -1)
    return event.tab.textLabel.slice(0, -labelAmount.length - 3).toLowerCase() as unknown as S
} 