import { When } from 'cypress-cucumber-preprocessor/steps'
import { filterBadgeSel } from '../../../elements/dashboardFilter'

When('I click on the {string} filter badge', filterName => {
    cy.get(filterBadgeSel).find('span:visible').contains(filterName).click()
})
