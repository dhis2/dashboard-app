const clickMenuButton = name => {
    cy.get(`[data-test="dashboard-item-prog-${name}"]`)
        .find('[data-test="item-menu-button"]')
        .click()
}

const clickViewAsChart = () => {
    cy.contains('View as Chart').click()
}

const clickViewAsTable = () => {
    cy.contains('View as Table').click()
}

const clickViewAsMap = () => {
    cy.contains('View as Map').click()
}

const expectChartToExist = name => {
    if (name) {
        cy.get(`[data-test="dashboard-item-prog-${name}"]`)
            .find('.highcharts-container')
            .should('exist')
            .and('be.visible')
    } else {
        cy.get('.highcharts-container').should('exist').and('be.visible')
    }
}

const expectTableToExist = name => {
    cy.get(`[data-test="dashboard-item-prog-${name}"]`)
        .find('.pivot-table-container')
        .should('exist')
        .and('be.visible')
}

const expectTableToNotExist = name => {
    cy.get(`[data-test="dashboard-item-prog-${name}"]`)
        .find('.pivot-table-container')
        .should('not.exist')
}

const expectChartToNotExist = name => {
    cy.get(`[data-test="dashboard-item-prog-${name}"]`)
        .find('.highcharts-container')
        .should('not.exist')
}

const expectMapToExist = name => {
    cy.get(`[data-test="dashboard-item-prog-${name}"]`)
        .find('.dhis2-map-plugin')
        .should('exist')
        .and('be.visible')
}

export const dashboardItem = {
    action: {
        clickMenuButton,
        clickViewAsChart,
        clickViewAsTable,
        clickViewAsMap,
    },
    expect: {
        chartExists: expectChartToExist,
        tableExists: expectTableToExist,
        mapExists: expectMapToExist,
        tableDoesNotExist: expectTableToNotExist,
        chartDoesNotExist: expectChartToNotExist,
    },
}
