import { newButtonSel } from '../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

export const startNewDashboard = () => {
    cy.get(newButtonSel, EXTENDED_TIMEOUT).click()
}
