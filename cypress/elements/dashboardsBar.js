const clickChip = name => {
    cy.get('[data-test="dhis2-uicore-chip"]').contains(name).click()
}

const toggleShowMoreButton = () => {
    cy.get('[data-test="showmore-button"]').click()
}

const clickNew = () => {
    cy.get('[data-test="link-new-dashboard"]').click()
}

const clickItemSearch = () => {
    cy.get('[data-test="item-search"]').click()
}

export const dashboardsBar = {
    clickChip,
    toggleShowMoreButton,
    clickNew,
    clickItemSearch,
}
