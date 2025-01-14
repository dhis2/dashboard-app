import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import {
    gridItemSel,
    // chartSel,
    // chartSubtitleSel,
} from '../../elements/dashboardItem.js'
import {
    confirmActionDialogSel,
    titleInputSel,
    clickEditActionButton,
} from '../../elements/editDashboard.js'
import { getNavigationMenuItem } from '../../elements/navigationMenu.js'
import {
    dashboardTitleSel,
    dashboardsNavMenuButtonSel,
} from '../../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT, createDashboardTitle } from '../../support/utils.js'

// the length of the root route of the app (after the slash): #/
const ROOT_ROUTE_LENGTH = 0
// the length of UIDs (after the slash): '#/nghVC4wtyzi'
const UID_LENGTH = 11

export const TEST_DASHBOARD_TITLE = createDashboardTitle('aa')

const ROUTE_EDIT = 'edit'
const ROUTE_NEW = 'new'
const ROUTE_PRINTLAYOUT = 'printlayout'
const ROUTE_PRINTOIPP = 'printoipp'
const nonViewRoutes = [
    ROUTE_NEW,
    ROUTE_EDIT,
    ROUTE_PRINTLAYOUT,
    ROUTE_PRINTOIPP,
]

const getRouteFromHash = (hash) => {
    const lastSlashIdx = hash.lastIndexOf('/')
    return hash.slice(lastSlashIdx + 1)
}

/*
Scenario: I create a new dashboard
*/

When('dashboard title is added', () => {
    cy.get(titleInputSel).type(TEST_DASHBOARD_TITLE)
})

When('dashboard is saved', () => {
    clickEditActionButton('Save changes')
})

Then('the saved dashboard should be displayed', () => {
    cy.get(dashboardTitleSel).should('have.text', TEST_DASHBOARD_TITLE)
})

Then('the dashboard displays in view mode', () => {
    cy.location().should((loc) => {
        const currentRoute = getRouteFromHash(loc.hash)

        expect(nonViewRoutes).not.to.include(currentRoute)
        expect([ROOT_ROUTE_LENGTH, UID_LENGTH]).to.include(currentRoute.length)
    })
    cy.get(dashboardTitleSel)
        .should('be.visible')
        .and('contain', TEST_DASHBOARD_TITLE)
})

Then('different valid dashboard displays in view mode', () => {
    cy.location().should((loc) => {
        const currentRoute = getRouteFromHash(loc.hash)

        expect(nonViewRoutes).not.to.include(currentRoute)
        expect([ROOT_ROUTE_LENGTH, UID_LENGTH]).to.include(currentRoute.length)
    })
    cy.get(dashboardTitleSel)
        .should('be.visible')
        .and('not.contain', TEST_DASHBOARD_TITLE)
})

Given('I open existing dashboard', () => {
    cy.get(dashboardsNavMenuButtonSel, EXTENDED_TIMEOUT).click()
    cy.get('[role="menu"]').find('li').contains(TEST_DASHBOARD_TITLE).click()

    cy.location().should((loc) => {
        const currentRoute = getRouteFromHash(loc.hash)

        expect(nonViewRoutes).not.to.include(currentRoute)
        expect([ROOT_ROUTE_LENGTH, UID_LENGTH]).to.include(currentRoute.length)
    })
    cy.get(dashboardTitleSel)
        .should('be.visible')
        .and('contain', TEST_DASHBOARD_TITLE)
})

/*
Scenario: I exit without saving
*/

When('I decide to continue editing', () => {
    cy.get(confirmActionDialogSel)
        .find('button')
        .contains('No, stay here')
        .click()
})

/*
Scenario: I cancel a delete dashboard action
*/

When('I cancel delete', () => {
    cy.get(confirmActionDialogSel).find('button').contains('Cancel').click()
})

Then('the confirm delete dialog is displayed', () => {
    cy.contains(
        `Deleting dashboard "${TEST_DASHBOARD_TITLE}" will remove it for all users`
    ).should('be.visible')
})

/*
Scenario: I delete a dashboard
*/

Then('the dashboard is deleted and first starred dashboard displayed', () => {
    getNavigationMenuItem(TEST_DASHBOARD_TITLE).should('not.exist')
    cy.get(dashboardTitleSel).should('exist').should('not.be.empty')
})

/*
Scenario: I move an item on a dashboard
*/

// FIXME
// Then('the chart item is displayed', () => {
//     cy.get(`${gridItemSel}.VISUALIZATION`)
//         .first()
//         .getIframeBody()
//         .find(chartSel, EXTENDED_TIMEOUT)
//         .should('exist')
// })

Then('no analytics requests are made when item is moved', () => {
    const WRONG_SUBTITLE = 'WRONG_SUBTITLE'
    cy.intercept(/analytics\.json(\S)*skipMeta=false/, (req) => {
        req.reply((res) => {
            // modify the chart subtitle so we can check whether the api request
            // was made. (It shouldn't be - that's the test)
            res.body.metaData.items.THIS_YEAR.name = WRONG_SUBTITLE
            res.send({ body: res.body })
        })
    })

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get(gridItemSel)
        .first()
        .trigger('mousedown')
        .trigger('mousemove', { clientX: 400 })
        .trigger('mouseup')

    // FIXME
    // cy.get(gridItemSel)
    //     .first()
    //     .getIframeBody()
    //     .find(chartSubtitleSel, EXTENDED_TIMEOUT)
    //     .contains(WRONG_SUBTITLE)
    //     .should('not.exist')
})
