import { When } from 'cypress-cucumber-preprocessor/steps'

When('I click to preview the print layout', () => {
    cy.clickMoreButton()
    cy.get('[data-test="print-menu-item"]').click()
    cy.get('[data-test="print-layout-menu-item"]').click()
})
