import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import { EXTENDED_TIMEOUT } from '../../../support/utils'
import {
    gridItemSel,
    chartSel,
    chartSubtitleSel,
} from '../../../selectors/dashboardItem'
import {
    dashboardChipSel,
    dashboardTitleSel,
} from '../../../selectors/viewDashboard'

// the length of the root route of the app (after the slash): #/
const ROOT_ROUTE_LENGTH = 0
// the length of UIDs (after the slash): '#/nghVC4wtyzi'
const UID_LENGTH = 11

export const TEST_DASHBOARD_TITLE = 'aa' + new Date().toUTCString()

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

const getRouteFromHash = hash => {
    const lastSlashIdx = hash.lastIndexOf('/')
    return hash.slice(lastSlashIdx + 1)
}

const toggleShowMoreButton = () => {
    cy.get('[data-test="showmore-button"]').click()
}

/*
Scenario: I create a new dashboard
*/

When('dashboard title is added', () => {
    cy.get('[data-test="dashboard-title-input"]').type(TEST_DASHBOARD_TITLE)
})

When('escape key is pressed', () => {
    cy.get('body').trigger('keydown', { key: 'Escape' })
    cy.get('[data-test="item-menu]').should('not.exist')
})

When('I click outside menu', () => {
    cy.get('[data-test="dhis2-uicore-layer"]').click('topLeft')
    cy.get('[data-test="item-menu]').should('not.exist')
})

When('dashboard is saved', () => {
    cy.get('button').contains('Save changes').click()
})

Then('the saved dashboard should be displayed', () => {
    cy.get('[data-test="view-dashboard-title"]').should(
        'have.text',
        TEST_DASHBOARD_TITLE
    )
})

Then('dashboard displays in view mode', () => {
    cy.location().should(loc => {
        const currentRoute = getRouteFromHash(loc.hash)

        expect(nonViewRoutes).not.to.include(currentRoute)
        expect([ROOT_ROUTE_LENGTH, UID_LENGTH]).to.include(currentRoute.length)
    })
    cy.get(dashboardTitleSel)
        .should('be.visible')
        .and('contain', TEST_DASHBOARD_TITLE)
})

Then('different dashboard displays in view mode', () => {
    cy.location().should(loc => {
        const currentRoute = getRouteFromHash(loc.hash)

        expect(nonViewRoutes).not.to.include(currentRoute)
        expect([ROOT_ROUTE_LENGTH, UID_LENGTH]).to.include(currentRoute.length)
    })
    cy.get(dashboardTitleSel)
        .should('be.visible')
        .and('not.contain', TEST_DASHBOARD_TITLE)
})

Given('I open existing dashboard', () => {
    toggleShowMoreButton()
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT)
        .contains(TEST_DASHBOARD_TITLE)
        .click()
})

When('I choose to delete dashboard', () => {
    cy.get('[data-test="delete-dashboard-button"]').click()
})

/*
Scenario: I cancel a delete dashboard action
*/

When('I cancel delete', () => {
    cy.get('[data-test="cancel-delete-dashboard"]').click()
})

Then('the confirm delete dialog is displayed', () => {
    cy.contains(
        `Deleting dashboard "${TEST_DASHBOARD_TITLE}" will remove it for all users`
    ).should('be.visible')
})

Then('the dashboard displays in edit mode', () => {
    cy.get('[data-test="dashboard-title-input"]').should('exist')

    cy.location().should(loc => {
        expect(getRouteFromHash(loc.hash)).to.eq(ROUTE_EDIT)
    })
})

/*
Scenario: I delete a dashboard
*/

When('I confirm delete', () => {
    cy.get('[data-test="confirm-delete-dashboard"]').click()
})

Then('the dashboard is deleted and first starred dashboard displayed', () => {
    toggleShowMoreButton()
    cy.get(dashboardChipSel).contains(TEST_DASHBOARD_TITLE).should('not.exist')

    cy.get('[data-test="view-dashboard-title"]')
        .should('exist')
        .should('not.be.empty')
})

/*
Scenario: I move an item on a dashboard
*/

Then('the chart item is displayed', () => {
    cy.get(chartSel, EXTENDED_TIMEOUT).should('exist')
})

Then('no analytics requests are made when item is moved', () => {
    const WRONG_SUBTITLE = 'WRONG_SUBTITLE'
    cy.intercept(/analytics\.json(\S)*skipMeta=false/, req => {
        req.reply(res => {
            // modify the chart subtitle so we can check whether the api request
            // was made. (It shouldn't be - that's the test)
            res.body.metaData.items.THIS_YEAR.name = WRONG_SUBTITLE
            res.send({ body: res.body })
        })
    })

    cy.get(gridItemSel)
        .first()
        .trigger('mousedown')
        .trigger('mousemove', { clientX: 400 })
        .trigger('mouseup')

    cy.get(chartSubtitleSel, EXTENDED_TIMEOUT)
        .contains(WRONG_SUBTITLE)
        .should('not.exist')
})
