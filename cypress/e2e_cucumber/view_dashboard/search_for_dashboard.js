import { When, Then } from '@badeball/cypress-cucumber-preprocessor'
import {
    getNavigationMenuFilter,
    getNavigationMenu,
} from '../../elements/navigationMenu.js'

When('I search for dashboards containing {string}', (title) => {
    getNavigationMenuFilter().type(title)
})

Then('Immunization and Immunization data dashboards are choices', () => {
    getNavigationMenu(true)
        .find('li')
        .should('be.visible')
        .and('have.length', 2)
})
When('I press tab in the search dashboard field and then enter', () => {
    cy.realPress('Tab')
    cy.realPress('Enter')
})

When('I press enter in the search dashboard field', () => {
    getNavigationMenuFilter(true).type('{enter}')
})

Then('no dashboards are choices', () => {
    getNavigationMenu(true)
        .find('li')
        .contains('No dashboards found')
        .should('be.visible')
})
