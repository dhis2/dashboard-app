const OPTIONS = { timeout: 10000 }

const clickChip = name => {
    cy.get('[data-test="dhis2-uicore-chip"]', OPTIONS).contains(name).click()
}

const toggleShowMoreButton = () => {
    cy.get('[data-test="showmore-button"]', OPTIONS).click()
}

const clickNew = () => {
    cy.get('[data-test="link-new-dashboard"]', OPTIONS).click()
}

const clickItemSearch = () => {
    cy.get('[data-test="item-search"]', OPTIONS).click()
}

export const dashboardsBar = {
    clickChip,
    toggleShowMoreButton,
    clickNew,
    clickItemSearch,
}
