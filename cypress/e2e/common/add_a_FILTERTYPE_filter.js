import { When } from '@badeball/cypress-cucumber-preprocessor'
import {
    unselectedItemsSel,
    filterDimensionsPanelSel,
    orgUnitTreeSel,
} from '../../elements/dashboardFilter.js'
import { EXTENDED_TIMEOUT } from '../../support/utils.js'

const PERIOD = 'Last 6 months'
const OU_ID = 'ImspTQPwCqd' //Sierra Leone
const FACILITY_TYPE = 'Clinic'

When('I add a {string} filter', (dimensionType) => {
    cy.containsExact('Filter').click()

    // select an item in the modal
    switch (dimensionType) {
        case 'Period':
            cy.get(filterDimensionsPanelSel).contains(dimensionType).click()
            cy.get(unselectedItemsSel).contains(PERIOD).dblclick()
            break
        case 'Organisation unit':
            cy.get(filterDimensionsPanelSel).contains(dimensionType).click()
            cy.get(orgUnitTreeSel, EXTENDED_TIMEOUT)
                .find('[type="checkbox"]', EXTENDED_TIMEOUT)
                .check(OU_ID)
            break
        case 'Org unit group':
            cy.get(filterDimensionsPanelSel)
                .contains('Organisation unit')
                .click()
            cy.getByDataTest('org-unit-group-select').click()
            cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
                .contains('District')
                .click()
            // close the popup
            cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
                .closest('[data-test="dhis2-uicore-layer"]')
                .click('topLeft')
            break

        default:
            cy.get(filterDimensionsPanelSel).contains(dimensionType).click()
            cy.get(unselectedItemsSel).contains(FACILITY_TYPE).dblclick()
    }

    // confirm to apply the filter
    cy.get('button').contains('Confirm').click()
})
