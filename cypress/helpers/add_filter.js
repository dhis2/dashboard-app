import {
    unselectedItemsSel,
    filterDimensionsPanelSel,
    orgUnitTreeSel,
    dimensionsModalSel,
} from '../elements/dashboardFilter.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

export const addFilter = (dimensionType, filterName) => {
    cy.contains('Add filter').click()

    // open the dimensions modal
    cy.getBySel(filterDimensionsPanelSel).contains(dimensionType).click()

    cy.getBySel(dimensionsModalSel, EXTENDED_TIMEOUT).should('be.visible')

    // select an item in the modal
    if (dimensionType === 'Period') {
        cy.get('[data-test*="dimension-transfer-sourceoptions"]')
            .contains(filterName)
            .dblclick()
    } else if (dimensionType === 'Organisation unit') {
        cy.getBySel(orgUnitTreeSel, EXTENDED_TIMEOUT)
            .find('[type="checkbox"]', EXTENDED_TIMEOUT)
            .check(filterName)
    } else {
        cy.getBySelLike(unselectedItemsSel).contains(filterName).dblclick()
    }

    // confirm to apply the filter
    cy.get('button').contains('Confirm').click()
}
