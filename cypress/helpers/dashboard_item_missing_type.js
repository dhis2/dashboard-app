import {
    getDashboardItem,
    clickItemDeleteButton,
} from '../elements/dashboardItem.js'
import {
    dashboardChipSel,
    dashboardTitleSel,
} from '../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

const ITEM_1_UID = 'GaVhJpqABYX'
const ITEM_2_UID = 'qXsjttMYuoZ'
const ITEM_3_UID = 'Rwb3oXJ3bZ9'

const interceptDashboardRequest = () => {
    cy.intercept(/dashboards\/iMnYyBfSxmM/, (req) => {
        req.reply((res) => {
            // modify 3 items with different styles of "missing" type property
            res.body.dashboardItems.find(
                (item) => item.id === ITEM_1_UID
            ).type = null

            const item = res.body.dashboardItems.find(
                (item) => item.id === ITEM_2_UID
            )

            delete item.type

            res.body.dashboardItems.find(
                (item) => item.id === ITEM_3_UID
            ).type = 'Unrecognized'

            res.send({ body: res.body })
        })
    })
}

export const openDashboardWithItemsMissingAType = (title) => {
    interceptDashboardRequest()
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT).contains(title).click()
    cy.get(dashboardTitleSel).should('be.visible').and('contain', title)
}

export const itemsMissingTypeAreDisplayedWithAWarning = () => {
    getDashboardItem(ITEM_1_UID)
        .scrollIntoView()
        .contains('The item type is missing')
        .should('be.visible')

    getDashboardItem(ITEM_2_UID)
        .scrollIntoView()
        .contains('The item type is missing')
        .should('be.visible')

    getDashboardItem(ITEM_3_UID)
        .scrollIntoView()
        .contains('Item type "Unrecognized" is not supported')
        .should('be.visible')
}

export const itemsCanBeDeleted = () => {
    clickItemDeleteButton(ITEM_1_UID)
    clickItemDeleteButton(ITEM_2_UID)
    clickItemDeleteButton(ITEM_3_UID)

    getDashboardItem(ITEM_1_UID).should('not.exist')
    getDashboardItem(ITEM_2_UID).should('not.exist')
    getDashboardItem(ITEM_3_UID).should('not.exist')
}
