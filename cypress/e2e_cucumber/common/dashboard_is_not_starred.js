import { Then } from '@badeball/cypress-cucumber-preprocessor'
import {
    dashboardUnstarredSel,
    dashboardStarredSel,
} from '../../elements/viewDashboard.js'

Then('the {string} dashboard is not starred', () => {
    // check for the unfilled star next to the title
    cy.get(dashboardUnstarredSel).should('be.visible')
    cy.get(dashboardStarredSel).should('not.exist')
})
