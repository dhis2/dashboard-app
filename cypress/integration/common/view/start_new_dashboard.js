import { Given } from 'cypress-cucumber-preprocessor/steps'
import { EXTENDED_TIMEOUT } from '../../../support/utils'
import { newButtonSel } from '../../../selectors/viewDashboard'

Given('I choose to create new dashboard', () => {
    cy.get(newButtonSel, EXTENDED_TIMEOUT).click()
})
