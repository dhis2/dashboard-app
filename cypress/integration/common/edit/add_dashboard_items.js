import { When } from 'cypress-cucumber-preprocessor/steps'

When('dashboard items are added', () => {
    cy.get('[data-test="item-search"]').click()
    cy.get('[data-test="menu-item-ANC: 1 and 3 coverage Yearly"]').click()
})
