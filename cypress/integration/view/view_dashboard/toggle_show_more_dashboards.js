import { When } from 'cypress-cucumber-preprocessor/steps'
import { showMoreLessSel } from '../../../elements/viewDashboard'

When('I toggle show more dashboards', () => {
    cy.get(showMoreLessSel).click()
})
