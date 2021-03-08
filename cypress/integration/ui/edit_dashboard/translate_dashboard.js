import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
// import { EXTENDED_TIMEOUT } from '../../../support/utils'
import { getApiBaseUrl } from '../../../support/server/utils'

import {
    dashboardTitleSel,
    dashboardDescriptionSel,
} from '../../../selectors/viewDashboard'

let norwegianTitle = ''
let norwegianDesc = ''

Given('instance has db language set to Norwegian', () => {
    cy.request(
        'POST',
        `${getApiBaseUrl()}/api/userSettings/keyDbLocale`,
        'no'
    ).then(response => {
        expect(response.status).to.equal(200)
    })
})

When('I add translations for dashboard name and description', () => {
    const now = new Date().toUTCString()
    norwegianTitle = 'nor title ' + now
    norwegianDesc = 'nor desc ' + now

    cy.get('button').contains('Translate').click()
    cy.contains('Select locale').click()
    cy.contains('Select locale').type('Norwegian{enter}')
    cy.get('[placeholder="Name"]').type(norwegianTitle)
    cy.get('[placeholder="Description"]').type(norwegianDesc)
    cy.get('button').contains('Save').click()
})

Then('Norwegian title and description are displayed', () => {
    // cy.get(dashboardTitleSel).contains(norwegianTitle).should('be.visible')

    cy.get('button').contains('More').click()
    cy.contains('Show description').click()

    cy.get(dashboardTitleSel)
        .should('be.visible')
        .and('contain', norwegianTitle)
    cy.get(dashboardDescriptionSel)
        .should('be.visible')
        .and('contain', norwegianDesc)

    cy.get('button').contains('More').click()
    cy.contains('Hide description').click()

    cy.request(
        'POST',
        `${getApiBaseUrl()}/api/userSettings/keyDbLocale`,
        'en'
    ).then(response => {
        expect(response.status).to.equal(200)
    })
})
