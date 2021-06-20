import { Given, Then } from 'cypress-cucumber-preprocessor/steps'
import { EXTENDED_TIMEOUT } from '../../../support/utils'
import {
    dashboardChipSel,
    dashboardTitleSel,
} from '../../../elements/viewDashboard'
import {
    getDashboardItem,
    clickItemDeleteButton,
} from '../../../elements/dashboardItem'

const ITEM_1_NAME = 'Delivery: Institutional delivery rates Yearly'
const ITEM_2_NAME = 'Delivery: Live births in facilities last 4 quarters'
const ITEM_3_NAME =
    'Delivery: Births (registered) in PHU vs Community last year'

const interceptDashboardRequest = () => {
    cy.intercept(/dashboards\/iMnYyBfSxmM/, req => {
        req.reply(res => {
            // modify 3 items with different styles of "missing" type property
            res.body.dashboardItems.find(
                item => item.id === ITEM_1_NAME
            ).type = null

            const item = res.body.dashboardItems.find(
                item => item.id === ITEM_2_NAME
            )

            delete item.type

            res.body.dashboardItems.find(item => item.id === ITEM_3_NAME).type =
                'Unrecognized'

            res.send({ body: res.body })
        })
    })
}

Given('I open the Delivery dashboard with items missing a type', () => {
    interceptDashboardRequest()
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT).contains('Delivery').click()
    cy.get(dashboardTitleSel).should('be.visible').and('contain', 'Delivery')
})

Then('the items missing type are displayed with a warning', () => {
    getDashboardItem(ITEM_1_NAME)
        .scrollIntoView()
        .contains('The item type is missing')
        .should('be.visible')

    getDashboardItem(ITEM_2_NAME)
        .scrollIntoView()
        .contains('The item type is missing')
        .should('be.visible')

    getDashboardItem(ITEM_3_NAME)
        .scrollIntoView()
        .contains('Item type "Unrecognized" is not supported')
        .should('be.visible')
})

Then('I can delete the items', () => {
    clickItemDeleteButton(ITEM_1_NAME)
    clickItemDeleteButton(ITEM_2_NAME)
    clickItemDeleteButton(ITEM_3_NAME)

    getDashboardItem(ITEM_1_NAME).should('not.exist')
    getDashboardItem(ITEM_2_NAME).should('not.exist')
    getDashboardItem(ITEM_3_NAME).should('not.exist')
})
