import { filterDimensionsPanelSel } from '../elements/dashboardFilter.js'
import {
    confirmActionDialogSel,
    clickEditActionButton,
} from '../elements/editDashboard.js'
import {
    dashboardTitleSel,
    clickViewActionButton,
} from '../elements/viewDashboard.js'

export const clickFilterSettings = () => {
    clickEditActionButton('Filter settings')
}

export const expectFilterRestrictionsToBeUnrestricted = () => {
    cy.contains('Allow filtering by all dimensions')
        .find('input')
        .should('be.checked')
        .closePopper()
}

export const expectFilterSettingsToBeUnrestricted = (title) => {
    expectFilterRestrictionsToBeUnrestricted()

    clickEditActionButton('Save changes')

    cy.getBySel(dashboardTitleSel).should('be.visible').and('contain', title)

    // FIXME
    // cy.location().should((loc) => {
    //     dashboardId = loc.hash
    // })
}

export const visitDashboardInEditMode = (dashboardId) => {
    cy.visit(`/${dashboardId}/edit`)
}

export const clickToRestrictFilterSettings = () => {
    cy.contains('Only allow filtering by selected dimensions').parent().click()
}

export const clickAwayWithoutConfirming = () => {
    cy.get('[data-test=dhis2-uicore-layer]').click('topLeft')
}

export const expectPeriodAndOrgUnitToBeSelectedByDefault = () => {
    cy.get('[data-test="dhis2-uicore-transfer-rightside"]')
        .contains('Period')
        .should('be.visible')
    cy.get('[data-test="dhis2-uicore-transfer-rightside"]')
        .contains('Organisation unit')
        .should('be.visible')
}

export const addFacilityOwnershipToSelectedFilters = () => {
    cy.get('div').contains('Facility Ownership').click()
    cy.get('[data-test="dhis2-uicore-transfer-actions-addindividual"]').click()
}

export const clickToAllowAllFilters = () => {
    cy.contains('Allow filtering by all dimensions').parent().click()
}

export const expectFilterRestrictionsToBeRestricted = () => {
    cy.contains('Only allow filtering by selected dimensions')
        .find('input')
        .should('be.checked')
    cy.get('[data-test="dhis2-uicore-transfer-rightside"]')
        .contains('Facility Ownership')
        .should('be.visible')
}

export const clickConfirm = () => {
    cy.get('button').contains('Confirm').click()
}

export const removeAllFiltersFromSelectedFilters = () => {
    cy.get('[data-test="dhis2-uicore-transfer-actions-removeall"]').click()
}

export const clickAddFilter = () => {
    clickViewActionButton('Add filter')
}

export const expectFacilityOwnershipToBeOnlyDimension = () => {
    cy.get(filterDimensionsPanelSel)
        .contains('Facility Ownership')
        .should('be.visible')
    cy.get(filterDimensionsPanelSel)
        .contains('MAIN DIMENSIONS', { matchCase: false })
        .should('not.exist')
    cy.get(filterDimensionsPanelSel)
        .contains('YOUR DIMENSIONS', { matchCase: false })
        .next('ul')
        .find('li')
        .should('have.length', 1)
}

export const expectAddFilterButtonToBeInvisible = () => {
    cy.contains('Add filter').should('not.exist')
}

export const deleteDashboard = () => {
    clickEditActionButton('Delete')
    cy.get(confirmActionDialogSel).find('button').contains('Delete').click()
}

export const expectDifferentDashboardToDisplay = (title) => {
    cy.getBySel(dashboardTitleSel)
        .should('be.visible')
        .and('not.contain', title)
}
