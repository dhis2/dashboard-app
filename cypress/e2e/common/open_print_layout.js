import { When } from '@badeball/cypress-cucumber-preprocessor'

When('I click to preview the print layout', () => {
    cy.get('[data-test="more-actions-button"]').click()
    cy.get('[data-test="print-menu-item"]').click()
    cy.get('[data-test="print-layout-menu-item"]').click()
})
