import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { clickEditActionButton } from '../../../elements/editDashboard.js'
import {
    dashboardTitleSel,
    dashboardDescriptionSel,
    clickViewActionButton,
} from '../../../elements/viewDashboard.js'
import { getApiBaseUrl } from '../../../support/server/utils.js'
import { EXTENDED_TIMEOUT } from '../../../support/utils.js'

let norwegianTitle = ''
let norwegianDesc = ''

beforeEach(() => {
    // set dblocale to English
    cy.request(
        'POST',
        `${getApiBaseUrl()}/api/userSettings/keyDbLocale`,
        'en'
    ).then((response) => {
        expect(response.status).to.equal(200)
    })
})

When('I add translations for dashboard name and description', () => {
    const now = new Date().toUTCString()
    norwegianTitle = 'nor title ' + now
    norwegianDesc = 'nor desc ' + now

    clickEditActionButton('Translate')
    cy.contains('Select locale').click()
    cy.contains('Select locale').type('Norwegian{enter}')
    cy.get('[placeholder="Name"]').clear()
    cy.get('[placeholder="Name"]').type(norwegianTitle)
    cy.get('[placeholder="Description"]').clear()
    cy.get('[placeholder="Description"]').type(norwegianDesc)
    cy.get('button').contains('Save', EXTENDED_TIMEOUT).click()
})

Then('Norwegian title and description are displayed', () => {
    // set dblocale to Norwegian
    cy.request(
        'POST',
        `${getApiBaseUrl()}/api/userSettings/keyDbLocale`,
        'no'
    ).then((response) => {
        expect(response.status).to.equal(200)
    })

    // reload the dashboard
    cy.visit('/')

    cy.get(dashboardTitleSel, EXTENDED_TIMEOUT)
        .should('be.visible')
        .and('contain', norwegianTitle)

    clickViewActionButton('More')
    cy.contains('Show description').click()

    cy.get(dashboardDescriptionSel)
        .should('be.visible')
        .and('contain', norwegianDesc)

    clickViewActionButton('More')
    cy.contains('Hide description').click()
})
