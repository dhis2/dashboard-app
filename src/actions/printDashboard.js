import { generateUid } from 'd2/uid'

import {
    SET_PRINT_DASHBOARD,
    CLEAR_PRINT_DASHBOARD,
    SET_PRINT_DASHBOARD_LAYOUT,
    ADD_PRINT_DASHBOARD_ITEM,
    REMOVE_PRINT_DASHBOARD_ITEM,
    UPDATE_PRINT_DASHBOARD_ITEM,
} from '../reducers/printDashboard'
import {
    NEW_ITEM_SHAPE,
    getGridItemProperties,
    getPageBreakItemShape,
    getPrintTitlePageItemShape,
} from '../components/ItemGrid/gridUtil'
import { itemTypeMap, PAGEBREAK } from '../modules/itemTypes'

// actions

export const acSetPrintDashboard = (dashboard, items) => {
    const val = {
        ...dashboard,
        dashboardItems: items,
    }

    return {
        type: SET_PRINT_DASHBOARD,
        value: val,
    }
}

export const acClearPrintDashboard = () => ({
    type: CLEAR_PRINT_DASHBOARD,
})

export const acUpdatePrintDashboardLayout = value => ({
    type: SET_PRINT_DASHBOARD_LAYOUT,
    value,
})

export const acAddPrintDashboardItem = item => {
    const type = item.type
    delete item.type
    const itemPropName = itemTypeMap[type].propName

    const id = generateUid()
    const gridItemProperties = getGridItemProperties(id)

    let shape
    if (type === PAGEBREAK) {
        const yPos = item.yPos || 0
        shape = getPageBreakItemShape(yPos, item.isStatic)
    } else {
        shape = getPrintTitlePageItemShape(item.isOipp)
    }

    return {
        type: ADD_PRINT_DASHBOARD_ITEM,
        value: {
            id,
            type,
            position: item.position || null,
            [itemPropName]: item.content,
            ...NEW_ITEM_SHAPE,
            ...gridItemProperties,
            ...shape,
        },
    }
}

export const acRemovePrintDashboardItem = value => ({
    type: REMOVE_PRINT_DASHBOARD_ITEM,
    value,
})

export const acUpdatePrintDashboardItem = item => ({
    type: UPDATE_PRINT_DASHBOARD_ITEM,
    value: item,
})
