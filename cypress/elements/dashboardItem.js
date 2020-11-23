const clickMenuButton = itemUid => {
    cy.get(`[data-test="dashboard-item-prog-${itemUid}"]`)
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

const expectChartToExist = itemUid => {
    cy.get(`[data-test="dashboard-item-prog-${itemUid}"]`)
        .find('.highcharts-container')
        .should('exist')
        .and('be.visible')
}

const expectTableToExist = itemUid => {
    cy.get(`[data-test="dashboard-item-prog-${itemUid}"]`)
        .find('.pivot-table-container')
        .should('exist')
        .and('be.visible')
}

const expectTableToNotExist = itemUid => {
    cy.get(`[data-test="dashboard-item-prog-${itemUid}"]`)
        .find('.pivot-table-container')
        .should('not.exist')
}

const expectChartToNotExist = itemUid => {
    cy.get(`[data-test="dashboard-item-prog-${itemUid}"]`)
        .find('.highcharts-container')
        .should('not.exist')
}

const expectMapToExist = itemUid => {
    cy.get(`[data-test="dashboard-item-prog-${itemUid}"]`)
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
