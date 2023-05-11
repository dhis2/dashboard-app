import {
    dimensionsModalSel,
    filterDimensionsPanelSel,
    filterBadgeSel,
} from '../elements/dashboardFilter.js'
import {
    gridItemSel,
    chartSel,
    tableSel,
    // itemMenuButtonSel,
} from '../elements/dashboardItem.js'
import {
    clickEditActionButton,
    confirmActionDialogSel,
    createDashboard,
} from '../elements/editDashboard.js'
import {
    clickViewActionButton,
    dashboardChipSel,
    dashboardTitleSel,
} from '../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT, createDashboardTitle } from '../support/utils.js'

export const TEST_DASHBOARD_TITLE = createDashboardTitle('0ff')

const VIS_NAME =
    'ANC: ANC reporting rate, coverage and visits last 4 quarters dual-axis'

export const createDashboardWithChartThatWillFail = (title) => {
    createDashboard(title, [VIS_NAME])
}

export const openDashboardWithChartThatWillFail = (title) => {
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT).contains(title).click()

    cy.get(dashboardTitleSel).should('be.visible').and('contain', title)
}

export const addFilterOfType = (dimensionType, filterName) => {
    cy.contains('Add filter').click()
    cy.get(filterDimensionsPanelSel).contains(dimensionType).click()
    cy.get(dimensionsModalSel, EXTENDED_TIMEOUT).should('be.visible')

    cy.contains(filterName).dblclick()

    cy.get('button').contains('Confirm').click()
}

export const errorMessageIsDisplayedOnItem = () => {
    cy.get(`${gridItemSel}.VISUALIZATION`)
        .first()
        .contains('There was an error loading data for this item')
        .should('be.visible')

    cy.get(`${gridItemSel}.VISUALIZATION`)
        .first()
        .contains('Open this item in Data Visualizer')
        .should('be.visible')

    // FIXME
    //    cy.get(`${gridItemSel}.VISUALIZATION`)
    //        .first()
    //        .getIframeBody()
    //        .find(chartSel)
    //        .should('not.exist')
}

export const errorMessageNotIncludingLinkIsDisplayedOnItem = () => {
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.contains('There was an error loading data for this item')
        .scrollIntoView()
        .should('be.visible')

    cy.contains('Open this item in Data Visualizer').should('not.exist')

    cy.get(`${gridItemSel}.VISUALIZATION`)
        .first()
        .find('iframe')
        .should('not.exist')
}

export const removeFilter = () => {
    cy.wait(4000) // eslint-disable-line cypress/no-unnecessary-waiting
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get(filterBadgeSel).scrollIntoView().contains('Remove').click()

    cy.get(filterBadgeSel).should('not.exist')
    cy.wait(4000) // eslint-disable-line cypress/no-unnecessary-waiting
}

export const visIsDisplayedCorrectly = (visType) => {
    if (visType === 'chart') {
        cy.get(`${gridItemSel}.VISUALIZATION`)
            .first()
            .getIframeBody()
            .find(chartSel)
            .should('be.visible')
    } else if (visType === 'table') {
        cy.get(`${gridItemSel}.VISUALIZATION`)
            .first()
            .getIframeBody()
            .find(tableSel)
            .should('be.visible')
    }
}

export const deleteDashboard = (title) => {
    //now cleanup
    clickViewActionButton('Edit')
    clickEditActionButton('Delete')
    cy.contains(
        `Deleting dashboard "${title}" will remove it for all users`
    ).should('be.visible')

    cy.get(confirmActionDialogSel).find('button').contains('Delete').click()
    cy.get(dashboardChipSel).contains(title).should('not.exist')

    cy.get(dashboardTitleSel).should('exist').should('not.be.empty')
}
