const OPTIONS = { timeout: 15000 }

export const filterBadgeSel = '[data-test="filter-badge"]'

export const dblclickDimension = (optionText, dimensionId) => {
    if (dimensionId === 'ou') {
        cy.get('[data-test="modal-dimension-ou"]', OPTIONS)
            .find('.arrow')
            .click()
        cy.get('[data-test="modal-dimension-ou"]', OPTIONS)
            .find('*[role="button"]')
            .contains(optionText, OPTIONS)
            .click()
    } else {
        cy.get('[data-test="dhis2-uicore-transfer-sourceoptions"]')
            .contains(optionText)
            .dblclick()
    }
}

export const getFilterDimensionsPanel = () =>
    cy.get('[data-test="dhis2-uicore-popover"]')

export const checkFilterBadgeContains = text => {
    cy.get('[data-test="filter-badge"]').contains(text).should('be.visible')
}
