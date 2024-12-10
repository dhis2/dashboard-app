import { When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { dimensionsModalSel } from '../../elements/dashboardFilter.js'
import { gridItemSel, chartSel } from '../../elements/dashboardItem.js'
import { titleInputSel } from '../../elements/editDashboard.js'
import {
    dashboardTitleSel,
    newButtonSel,
} from '../../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../../support/utils.js'

const TEST_DASHBOARD_TITLE = 'TEST_DASHBOARD_TITLE'

When('I go to small screen', () => {
    cy.viewport(460, 600)
    // to account for debounced window resize
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
})

When('dashboard title is changed', () => {
    cy.get(titleInputSel).type(TEST_DASHBOARD_TITLE)
})

Then('the small screen view is shown', () => {
    //controlbar - no search dashboard field
    cy.get(newButtonSel).should('not.be.visible')

    //titlebar - only the More button and the title
    cy.get('button').contains('Edit').should('not.be.visible')
    cy.get('button').contains('Share').should('not.be.visible')
    cy.get('button').contains('Filter').should('not.be.visible')
})

When('I restore the wide screen', () => {
    cy.viewport(950, 800)
    // to account for debounced window resize
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
})

Then('the wide screen view is shown', () => {
    cy.get(newButtonSel).should('be.visible')

    cy.get('button').contains('Edit').should('be.visible')
    cy.get('button').contains('Share').should('be.visible')
    cy.get('button').contains('Filter').should('be.visible')
})

Then('the small screen edit view is shown', () => {
    //no controlbar
    cy.contains('Save changes').should('not.be.visible')
    cy.contains('Exit without saving').should('not.be.visible')

    //notice box and no dashboard
    cy.contains('dashboards on small screens is not supported').should(
        'be.visible'
    )
    // no title or item grid
    cy.get(titleInputSel).should('not.be.visible')
    cy.get('.react-grid-layout').should('not.be.visible')
})

Then('the wide screen edit view is shown', () => {
    //controlbar
    cy.get('button').contains('Save changes').should('be.visible')
    cy.get('button').contains('Exit without saving').should('be.visible')

    cy.get(titleInputSel).scrollIntoView()
    cy.get(titleInputSel).should('be.visible')
    cy.get('.react-grid-layout').should('be.visible')
})

Then('my changes are still there', () => {
    cy.get(titleInputSel).scrollIntoView()
    //title or item changes
    var re = new RegExp(TEST_DASHBOARD_TITLE, 'g')
    cy.get(`${titleInputSel} input`).should(($input) => {
        const val = $input.val()

        expect(val).to.match(re)
    })
})

// Scenario: I change the url to new while in small screen
When('I change url to new', () => {
    const url = `${Cypress.config().baseUrl}/#/new`
    cy.window().then((win) => {
        win.location.assign(url)
        cy.wait(2000) // eslint-disable-line cypress/no-unnecessary-waiting
    })
})

Then('the {string} dashboard displays in default view mode', (title) => {
    cy.location().should((loc) => {
        expect(loc.hash).to.equal('#/')
    })

    cy.get(dashboardTitleSel).should('be.visible').and('contain', `${title}`)

    cy.get(`${gridItemSel}.VISUALIZATION`).first().getIframeBody().as('iframe')
    cy.get('@iframe').find(chartSel, EXTENDED_TIMEOUT).as('vis')
    cy.get('@vis').should('be.visible')
})

// Scenario: I change the url to 'edit' while in small screen
When('I change url to edit', () => {
    cy.location().then((loc) => {
        const url = `${loc.href}/edit`
        cy.window().then((win) => {
            win.location.assign(url)
            cy.wait(2000) // eslint-disable-line cypress/no-unnecessary-waiting
        })
    })
})

Then('the filter modal is not opened', () => {
    cy.get(dimensionsModalSel, EXTENDED_TIMEOUT).should('not.exist')
})
