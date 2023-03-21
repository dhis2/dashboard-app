import {
    unselectedItemsSel,
    filterDimensionsPanelSel,
    orgUnitTreeSel,
} from '../../../elements/dashboardFilter.js'
import { EXTENDED_TIMEOUT } from '../../../support/utils.js'

const PERIOD = 'Last 6 months'
const OU_ID = 'ImspTQPwCqd' //Sierra Leone
const FACILITY_TYPE = 'Clinic'

// When('I add a {string} filter', (dimensionType) => {
export const addFilter = (dimensionType) => {
    cy.contains('Add filter').click()

    // open the dimensions modal
    cy.get(filterDimensionsPanelSel).contains(dimensionType).click()

    // select an item in the modal
    if (dimensionType === 'Period') {
        cy.get(unselectedItemsSel).contains(PERIOD).dblclick()
    } else if (dimensionType === 'Organisation unit') {
        cy.get(orgUnitTreeSel, EXTENDED_TIMEOUT)
            .find('[type="checkbox"]', EXTENDED_TIMEOUT)
            .check(OU_ID)
    } else {
        cy.get(unselectedItemsSel).contains(FACILITY_TYPE).dblclick()
    }

    // confirm to apply the filter
    cy.get('button').contains('Confirm').click()
}
