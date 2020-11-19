const clickDelete = () => {
    cy.get('[data-test="delete-dashboard-button"]').click()
}

const clickSave = () => {
    cy.get('[data-test="save-dashboard-button"]').click()
}

export const editBar = {
    clickDelete,
    clickSave,
}
