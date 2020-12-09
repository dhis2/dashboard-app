import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import {
    gridItemSel,
    chartSel,
    chartSubtitleSel,
} from '../../../selectors/dashboardItem'
import { dashboardChipSel } from '../../../selectors/dashboardsBar'

// the length of the root route of the app (after the slash): #/
const ROOT_ROUTE_LENGTH = 0
// the length of UIDs (after the slash): '#/nghVC4wtyzi'
const UID_LENGTH = 11

const TEST_DASHBOARD_TITLE = new Date().toUTCString()

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
Given('I choose to create new dashboard', () => {
    cy.get('[data-test="link-new-dashboard"]', {
        timeout: 15000,
    }).click()
})

When('dashboard title is added', () => {
    cy.get('[data-test="dashboard-title-input"]').type(TEST_DASHBOARD_TITLE)
})

When('dashboard items are added', () => {
    cy.get('[data-test="item-search"]').click()
    cy.get('[data-test="menu-item-ANC: 1 and 3 coverage Yearly"]').click()
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
    cy.get('[data-test="save-dashboard-button"]').click()
})

Then('the saved dashboard should be displayed', () => {
    cy.get('[data-test="view-dashboard-title"]').contains(TEST_DASHBOARD_TITLE)
})

Then('dashboard displays in view mode', () => {
    cy.location().should(loc => {
        const currentRoute = getRouteFromHash(loc.hash)

        expect(nonViewRoutes).not.to.include(currentRoute)
        expect([ROOT_ROUTE_LENGTH, UID_LENGTH]).to.include(currentRoute.length)
    })
})

Given('I open existing dashboard', () => {
    toggleShowMoreButton()
    cy.get(dashboardChipSel).contains(TEST_DASHBOARD_TITLE).click()
})

When('I choose to edit dashboard', () => {
    cy.get('[data-test="link-edit-dashboard"]').click()
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
    cy.get(chartSel).should('exist')
})

Then('no analytics requests are made when item is moved', () => {
    const WRONG_SUBTITLE = 'WRONG_SUBTITLE'
    cy.intercept(/analytics\.json(\S)*skipMeta=false/, req => {
        req.reply(res => {
            // modify the chart subtitle so we can check whether the api request
            // was made. (It shouldn't be - that's the test)
            const metaData = res.body.metaData
            metaData.items.THIS_YEAR.name = WRONG_SUBTITLE

            const newResponse = Object.assign({}, res.body, { metaData })
            res.send({ body: newResponse })
        })
    })

    cy.get(gridItemSel)
        .first()
        .trigger('mousedown')
        .trigger('mousemove', { clientX: 400 })
        .trigger('mouseup')

    cy.get(chartSubtitleSel).contains(WRONG_SUBTITLE).should('not.exist')
})
