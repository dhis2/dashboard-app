import {
    // dimensionsModalSel,
    // filterDimensionsPanelSel,
    filterBadgeSel,
} from '../elements/dashboardFilter.js'
import {
    gridItemClass,
    chartClass,
    tableClass,
} from '../elements/dashboardItem.js'
import {
    dashboardChipSel,
    dashboardTitleSel,
} from '../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'
import { createDashboard } from './dashboard.js'

const VIS_NAME =
    'ANC: ANC reporting rate, coverage and visits last 4 quarters dual-axis'

export const createDashboardWithChartThatWillFail = (title) => {
    createDashboard(title, [VIS_NAME])
}

export const openDashboardWithChartThatWillFail = (title) => {
    cy.getBySel(dashboardChipSel, EXTENDED_TIMEOUT).contains(title).click()

    cy.getBySel(dashboardTitleSel).should('be.visible').and('contain', title)
}

export const errorMessageIsDisplayedOnItem = () => {
    cy.get(`${gridItemClass}.VISUALIZATION`)
        .first()
        .contains('There was an error loading data for this item')
        .should('be.visible')

    cy.get(`${gridItemClass}.VISUALIZATION`)
        .first()
        .contains('Open this item in Data Visualizer')
        .should('be.visible')

    cy.get(`${gridItemClass}.VISUALIZATION`)
        .first()
        .getIframeBody()
        .find(chartClass)
        .should('not.exist')
}

export const errorMessageNotIncludingLinkIsDisplayedOnItem = () => {
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.contains('There was an error loading data for this item')
        .scrollIntoView()
        .should('be.visible')

    cy.contains('Open this item in Data Visualizer').should('not.exist')

    cy.get(`${gridItemClass}.VISUALIZATION`)
        .first()
        .find('iframe')
        .should('not.exist')
}

export const removeFilter = () => {
    cy.wait(4000) // eslint-disable-line cypress/no-unnecessary-waiting
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.getBySel(filterBadgeSel).scrollIntoView().contains('Remove').click()

    cy.getBySel(filterBadgeSel).should('not.exist')
    cy.wait(4000) // eslint-disable-line cypress/no-unnecessary-waiting
}

export const visIsDisplayedCorrectly = (visType) => {
    if (visType === 'chart') {
        cy.get(`${gridItemClass}.VISUALIZATION`)
            .first()
            .getIframeBody()
            .find(chartClass)
            .should('be.visible')
    } else if (visType === 'table') {
        cy.get(`${gridItemClass}.VISUALIZATION`)
            .first()
            .getIframeBody()
            .find(tableClass)
            .should('be.visible')
    }
}
