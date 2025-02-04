// import { dashboards } from '../assets/backends/index.js'
import {
    // clickViewActionButton,
    dashboardDescriptionSel,
} from '../elements/viewDashboard.js'
// import { getApiBaseUrl } from '../support/utils.js'

// const RESP_CODE_FAIL = 409
// const RESP_CODE_200 = 200
// const RESP_CODE_201 = 201

describe('description', () => {
    //  Scenario: I toggle show description
    //  Given I open existing dashboard
    //  And the description is not shown
    //  And the dashboard description is not displayed
    //  When I click to show description
    //  Then the dashboard description is displayed
    //  When I click to hide the description
    //  Then the dashboard description is not displayed
    it('should toggle show description', () => {
        //ensure that the description is not currently shown
        // cy.request({
        //     method: 'PUT',
        //     url: `${getApiBaseUrl()}/api/userDataStore/dashboard/showDescription`,
        //     headers: {
        //         'content-type': 'application/json',
        //     },
        //     body: 'false',
        // }).then((response) =>
        //     expect(response.status).to.be.oneOf([RESP_CODE_201, RESP_CODE_200])
        // )

        // cy.intercept('PUT', '**/userDataStore/dashboard/showDescription').as(
        //     'toggleDescription'
        // )

        cy.visit('/')
        // cy.wait(1000)
        cy.getByDataTest('view-dashboard-title').should('be.visible')
        // cy.getByDataTest('more-actions-button').click()
        // clickViewActionButton('Show description')

        // cy.wait('@toggleDescription')
        //     .its('response.statusCode')
        //     .should('be.oneOf', [RESP_CODE_200, RESP_CODE_201])

        // cy.get(dashboardDescriptionSel).should('be.visible')
        cy.get(dashboardDescriptionSel).should('not.exist')

        // cy.getByDataTest('more-actions-button').click()
        // cy.get('li').contains('Show description').click()

        // cy.get('[data-test="dhis2-uicore-alertbar"]')
        //     .should('be.visible')
        //     .should('have.class', 'warning')
        // cy.contains('Failed to show description').should('be.visible')
    })

    // # Scenario: Toggling show description fails
    // #     Given I open the "Delivery" dashboard
    // #     When clicking to show description fails
    // #     Then a warning message is displayed stating that show description failed
    // #     And the dashboard description is not displayed
    // it('fails', () => {})
})

// TODO - once the offline tests are enabled, goOnline needs to be called in the specific
// tests when needed rather than a beforeEach since this runs before every test
// regardless of test file
// before(() => {
//     //ensure that the description is not currently shown
//     cy.request({
//         method: 'PUT',
//         url: `${getApiBaseUrl()}/api/userDataStore/dashboard/showDescription`,
//         headers: {
//             'content-type': 'application/json',
//         },
//         body: 'false',
//     }).then((response) =>
//         expect(response.status).to.be.oneOf([RESP_CODE_201, RESP_CODE_200])
//     )
// })

// Then('the
//     ', () => {
//     cy.get(dashboardDescriptionSel).should('not.exist')
// })

// Then('the dashboard description is displayed', () => {
//     cy.get(dashboardDescriptionSel).should('be.visible')
// })

// When('I click to hide the description', () => {
//     clickViewActionButton('More')
//     cy.contains('Hide description').click()

//     cy.wait('@toggleDescription')
//         .its('response.statusCode')
//         .should('be.oneOf', [RESP_CODE_200, RESP_CODE_201])
// })

// Error scenario

// TODO We do not want this to run at the start of the suite. It should only run
// before the first scenario that needs it.
// before(() => {
//     //first ensure that the description is not currently shown
//     cy.request({
//         method: 'PUT',
//         url: `${getApiBaseUrl()}/api/userDataStore/dashboard/showDescription`,
//         headers: {
//             'content-type': 'application/json',
//         },
//         body: 'false',
//     }).then((response) =>
//         expect(response.status).to.be.oneOf(200, 201)
//     )
// })

// When('clicking to show description fails', () => {
//     cy.intercept('PUT', 'userDataStore/dashboard/showDescription', {
//         statusCode: RESP_CODE_FAIL,
//     }).as('showDescriptionFails')

//     cy.get('button').contains('More').click()
//     cy.contains('Show description').click()

//     cy.wait('@showDescriptionFails')
//         .its('response.statusCode')
//         .should('eq', RESP_CODE_FAIL)
// })

// Then(
//     'a warning message is displayed stating that show description failed',
//     () => {
//         cy.get('[data-test="dhis2-uicore-alertbar"]')
//             .should('be.visible')
//             .should('have.class', 'warning')

//         cy.contains('Failed to show description').should('be.visible')
//     }
// )
