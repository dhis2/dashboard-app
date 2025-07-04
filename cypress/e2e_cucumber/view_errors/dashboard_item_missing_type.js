import { Given, Then } from '@badeball/cypress-cucumber-preprocessor'
import {
    getDashboardItem,
    clickItemDeleteButton,
} from '../../elements/dashboardItem.js'
import { getNavigationMenuItem } from '../../elements/navigationMenu.js'
import { dashboardTitleSel } from '../../elements/viewDashboard.js'

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

Given('I open the Delivery dashboard with items missing a type', () => {
    interceptDashboardRequest()
    getNavigationMenuItem('Delivery').click()
    cy.get(dashboardTitleSel).should('be.visible').and('contain', 'Delivery')
})

Then('the items missing type are displayed with a warning', () => {
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
})

Then('I can delete the items', () => {
    clickItemDeleteButton(ITEM_1_UID)
    clickItemDeleteButton(ITEM_2_UID)
    clickItemDeleteButton(ITEM_3_UID)

    getDashboardItem(ITEM_1_UID).should('not.exist')
    getDashboardItem(ITEM_2_UID).should('not.exist')
    getDashboardItem(ITEM_3_UID).should('not.exist')
})
