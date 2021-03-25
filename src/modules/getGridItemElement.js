import { getGridItemDomElementClassName } from './getGridItemDomElementClassName'

export const getGridItemElement = itemId =>
    document.querySelector(`.${getGridItemDomElementClassName(itemId)}`)
