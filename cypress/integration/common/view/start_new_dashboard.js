import { Given } from 'cypress-cucumber-preprocessor/steps'
import { EXTENDED_TIMEOUT } from '../../../support/utils'
import { newButtonSel } from '../../../selectors/viewDashboard'

Given('I start a new dashboard', () => {
    cy.get(newButtonSel, EXTENDED_TIMEOUT).click()
})
