import { When } from 'cypress-cucumber-preprocessor/steps'
import {
    unselectedItemsSel,
    filterDimensionsPanelSel,
    dimensionsModalSel,
    orgUnitCheckboxesSel,
} from '../../../elements/dashboardFilter'
import { EXTENDED_TIMEOUT } from '../../../support/utils'

const PERIOD = 'Last 6 months'
const OU = 'Sierra Leone'
const FACILITY_TYPE = 'Clinic'

When('I add a {string} filter', (dimensionType) => {
    cy.contains('Add filter').click()

    // open the dimensions modal
    cy.get(filterDimensionsPanelSel).contains(dimensionType).click()

    // select an item in the modal
    if (dimensionType === 'Period') {
        cy.get(unselectedItemsSel).contains(PERIOD).dblclick()
    } else if (dimensionType === 'Organisation Unit') {
        cy.get(dimensionsModalSel, EXTENDED_TIMEOUT).find('.arrow').click()
        cy.get(dimensionsModalSel, EXTENDED_TIMEOUT)
            .find(orgUnitCheckboxesSel, EXTENDED_TIMEOUT)
            .contains(OU, EXTENDED_TIMEOUT)
            .click()
    } else {
        cy.get(unselectedItemsSel).contains(FACILITY_TYPE).dblclick()
    }

    // confirm to apply the filter
    cy.get('button').contains('Confirm').click()
})
