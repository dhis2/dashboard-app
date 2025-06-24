import { getDashboardItem } from '../elements/dashboardItem.js'
import { getNavigationMenuItem } from '../elements/navigationMenu.js'
import { dashboardTitleSel } from '../elements/viewDashboard.js'

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

// Scenario: View dashboard containing item that is missing type
//         Given I open the Delivery dashboard with items missing a type
//         # Then the "Delivery" dashboard displays in view mode
//         Then the items missing type are displayed with a warning
//         And I can delete the items
it('View dashboard containing item that is missing type', () => {
    interceptDashboardRequest()
    cy.visit('/')
    getNavigationMenuItem('Delivery').click()

    // Check that the dashboard title is displayed
    cy.get(dashboardTitleSel).should('be.visible').and('contain', 'Delivery')

    // Check that the items are displayed with a warning
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
