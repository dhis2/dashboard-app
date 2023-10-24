import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { EXTENDED_TIMEOUT } from '../../../support/utils'
import { getApiBaseUrl } from '../../../support/server/utils'

import {
    dashboardTitleSel,
    dashboardDescriptionSel,
} from '../../../selectors/viewDashboard'

let norwegianTitle = ''
let norwegianDesc = ''

beforeEach(() => {
    //first ensure that the description is not currently shown
    cy.request({
        method: 'PUT',
        url: `${getApiBaseUrl()}/api/userDataStore/dashboard/showDescription`,
        headers: {
            'content-type': 'application/json',
        },
        body: 'false',
    }).then(response => expect(response.status).to.equal(201))
})

beforeEach(() => {
    // set dblocale to English
    cy.request(
        'POST',
        `${getApiBaseUrl()}/api/userSettings/keyDbLocale`,
        'en'
    ).then(response => {
        expect(response.status).to.equal(200)
    })
})

afterEach(() => {
    // set dblocale to English
    cy.request(
        'POST',
        `${getApiBaseUrl()}/api/userSettings/keyDbLocale`,
        'en'
    ).then(response => {
        expect(response.status).to.equal(200)
    })
})

When('I add translations for dashboard name and description', () => {
    const now = new Date().toUTCString()
    norwegianTitle = 'nor title ' + now
    norwegianDesc = 'nor desc ' + now

    cy.clickEditActionButton('Translate')
    cy.contains('Select locale').click()
    cy.contains('Select locale').type('Norwegian{enter}')
    cy.get('[placeholder="Name"]').clear().type(norwegianTitle)
    cy.get('[placeholder="Description"]').clear().type(norwegianDesc)
    cy.get('button').contains('Save', EXTENDED_TIMEOUT).click()
})

Then('Norwegian title and description are displayed', () => {
    // set dblocale to Norwegian
    cy.request(
        'POST',
        `${getApiBaseUrl()}/api/userSettings/keyDbLocale`,
        'no'
    ).then(response => {
        expect(response.status).to.equal(200)
    })

    // reload the dashboard
    cy.visit('/')

    cy.get(dashboardTitleSel, EXTENDED_TIMEOUT)
        .should('be.visible')
        .and('contain', norwegianTitle)

    cy.clickMoreButton()
    cy.contains('Show description').click()

    cy.get(dashboardDescriptionSel)
        .should('be.visible')
        .and('contain', norwegianDesc)

    cy.clickMoreButton()
    cy.contains('Hide description').click()
})