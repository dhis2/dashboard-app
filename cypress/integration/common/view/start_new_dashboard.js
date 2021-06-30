import { Given } from 'cypress-cucumber-preprocessor/steps'
import { newButtonSel } from '../../../elements/viewDashboard'
import { EXTENDED_TIMEOUT } from '../../../support/utils'

Given('I start a new dashboard', () => {
    cy.get(newButtonSel, EXTENDED_TIMEOUT).click()
})
