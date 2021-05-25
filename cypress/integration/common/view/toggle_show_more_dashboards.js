import { When } from 'cypress-cucumber-preprocessor/steps'

When('I toggle show more dashboards', () => {
    cy.get('[data-test="showmore-button"]').click()
})
