import { When } from '@badeball/cypress-cucumber-preprocessor'
import { filterBadgeSel } from '../../../elements/dashboardFilter.js'

When('I click on the {string} filter badge', (filterName) => {
    cy.get(filterBadgeSel).find('span:visible').contains(filterName).click()
})
