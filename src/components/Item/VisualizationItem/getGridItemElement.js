import { getGridItemDomElementClassName } from '../../../modules/getGridItemDomElementClassName.js'

export const getGridItemElement = (itemId) =>
    document.querySelector(`.${getGridItemDomElementClassName(itemId)}`)
