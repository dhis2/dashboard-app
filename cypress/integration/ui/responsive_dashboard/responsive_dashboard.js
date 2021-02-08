import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { EXTENDED_TIMEOUT } from '../../../support/utils'
import { chartSel } from '../../../selectors/dashboardItem'
import { dashboardTitleSel } from '../../../selectors/viewDashboard'

const TEST_DASHBOARD_TITLE = 'TEST_DASHBOARD_TITLE'

When('I go to small screen', () => {
    cy.viewport(460, 600)
    // to account for debounced window resize
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
})

When('dashboard title is changed', () => {
    cy.get('[data-test="dashboard-title-input"]').type(TEST_DASHBOARD_TITLE)
})

Then('the small screen view is shown', () => {
    //controlbar - no search dashboard field
    cy.get('[data-test="link-new-dashboard"]').should('not.be.visible')

    //titlebar - only the More button and the title
    cy.get('button').contains('Edit').should('not.be.visible')
    cy.get('button').contains('Share').should('not.be.visible')
    cy.get('button').contains('Add filter').should('not.be.visible')
    cy.get('button.small').contains('More').should('be.visible')
    cy.get('button').not('.small').contains('More').should('not.be.visible')
})

When('I restore the wide screen', () => {
    cy.viewport(900, 800)
    // to account for debounced window resize
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
})

Then('the wide screen view is shown', () => {
    cy.get('[data-test="link-new-dashboard"]').should('be.visible')

    cy.get('button').contains('Edit').should('be.visible')
    cy.get('button').contains('Share').should('be.visible')
    cy.get('button').contains('Add filter').should('be.visible')
    cy.get('button').not('.small').contains('More').should('be.visible')
    cy.get('button.small').contains('More').should('not.be.visible')
})

Then('the small screen edit view is shown', () => {
    //no controlbar
    cy.contains('Save changes').should('not.exist')
    cy.contains('Exit without saving').should('not.exist')

    //notice box and no dashboard
    cy.contains('dashboards on small screens is not supported').should(
        'be.visible'
    )
    // no title or item grid
    cy.get('[data-test="dashboard-title-input"]').should('not.exist')
    cy.get('.react-grid-layout').should('not.exist')
})

Then('the wide screen edit view is shown', () => {
    //controlbar
    cy.get('button').contains('Save changes').should('be.visible')
    cy.get('button').contains('Exit without saving').should('be.visible')

    cy.get('[data-test="dashboard-title-input"]').should('be.visible')
    cy.get('.react-grid-layout').should('be.visible')
})

Then('my changes are still there', () => {
    //title or item changes
    var re = new RegExp(TEST_DASHBOARD_TITLE, 'g')
    cy.get('[data-test="dashboard-title-input"] input').should($input => {
        const val = $input.val()

        expect(val).to.match(re)
    })
})

// Scenario: I change the url to new while in small screen
When('I change url to new', () => {
    const url = `${Cypress.config().baseUrl}/#/new`
    cy.window().then(win => {
        win.location.assign(url)
        cy.wait(2000) // eslint-disable-line cypress/no-unnecessary-waiting
    })
})

Then('the {string} dashboard displays in default view mode', title => {
    cy.location().should(loc => {
        expect(loc.hash).to.equal('#/')
    })

    cy.get(dashboardTitleSel).should('be.visible').and('contain', title)
    cy.get(chartSel, EXTENDED_TIMEOUT).should('exist')
})

// Scenario: I change the url to 'edit' while in small screen
When('I change url to edit', () => {
    cy.location().then(loc => {
        const url = `${loc.href}/edit`
        cy.window().then(win => {
            win.location.assign(url)
            cy.wait(2000) // eslint-disable-line cypress/no-unnecessary-waiting
        })
    })
})
