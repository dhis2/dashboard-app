import { When } from '@badeball/cypress-cucumber-preprocessor'
import { itemMenuSel } from '../../elements/editDashboard.js'

When('I close the item selector', () => {
    //close modal
    cy.get('[data-test="dhis2-uicore-layer"]').click('topLeft')

    cy.get(itemMenuSel).should('not.exist')
})
