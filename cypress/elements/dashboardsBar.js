const clickChip = name => {
    cy.get('[data-test="dhis2-uicore-chip"]').contains(name).click()
}

const toggleShowMoreButton = () => {
    cy.get('[data-test="showmore-button"]').click()
}

export const dashboardsBar = {
    clickChip,
    toggleShowMoreButton,
}
