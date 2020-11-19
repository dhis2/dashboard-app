const clickContextMenu = name => {
    cy.get(`[data-test="dashboard-item-prog-${name}"]`)
        .find('[data-test="item-context-menu"]')
        .click()
}

const clickViewAsChart = () => {
    cy.get('[data-test="item-viewas-chart"]').click()
}

const clickViewAsTable = () => {
    cy.get('[data-test="item-viewas-table"]').click()
}

const clickViewAsMap = () => {
    cy.get('[data-test="item-viewas-map"]').click()
}

export const itemContextMenu = {
    clickContextMenu,
    clickViewAsChart,
    clickViewAsTable,
    clickViewAsMap,
}

export const expectChartToExist = name => {
    if (name) {
        cy.get(`[data-test="dashboard-item-prog-${name}"]`)
            .find('.highcharts-container')
            .should('exist')
            .and('be.visible')
    } else {
        cy.get('.highcharts-container').should('exist').and('be.visible')
    }
}

export const expectTableToExist = name => {
    cy.get(`[data-test="dashboard-item-prog-${name}"]`)
        .find('.pivot-table-container')
        .should('exist')
        .and('be.visible')
}

export const expectTableToNotExist = name => {
    cy.get(`[data-test="dashboard-item-prog-${name}"]`)
        .find('.pivot-table-container')
        .should('not.exist')
}

export const expectChartToNotExist = name => {
    cy.get(`[data-test="dashboard-item-prog-${name}"]`)
        .find('.highcharts-container')
        .should('not.exist')
}

export const expectMapToExist = name => {
    cy.get(`[data-test="dashboard-item-prog-${name}"]`)
        .find('.dhis2-map-plugin')
        .should('exist')
        .and('be.visible')
}
