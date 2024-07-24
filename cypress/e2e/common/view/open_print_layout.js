import { When } from '@badeball/cypress-cucumber-preprocessor'
import { clickViewActionButton } from '../../../elements/viewDashboard.js'

When('I click to preview the print layout', () => {
    clickViewActionButton('More')
    cy.get('[data-test="print-menu-item"]').click()
    cy.get('[data-test="print-layout-menu-item"]').click()
})
