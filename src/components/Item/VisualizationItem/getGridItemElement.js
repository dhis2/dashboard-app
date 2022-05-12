import { getGridItemDomElementClassName } from '../../../modules/getGridItemDomElementClassName'

export const getGridItemElement = (itemId) =>
    document.querySelector(`.${getGridItemDomElementClassName(itemId)}`)
