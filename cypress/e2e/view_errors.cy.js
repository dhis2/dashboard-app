import { dashboards } from '../assets/backends/sierraLeone_236.js'
import { itemMenuButtonSel } from '../elements/dashboardItem.js'
import {
    clickEditActionButton,
    confirmActionDialogSel,
} from '../elements/editDashboard.js'
import {
    newButtonSel,
    dashboardDescriptionSel,
    dashboardTitleSel,
    dashboardChipSel,
    clickViewActionButton,
} from '../elements/viewDashboard.js'
import { addFilter } from '../helpers/add_filter.js'
import {
    openDashboardWithItemsMissingAType,
    itemsMissingTypeAreDisplayedWithAWarning,
    itemsCanBeDeleted,
} from '../helpers/dashboard_item_missing_type.js'
import {
    openDashboard,
    chooseToEditDashboard,
    expectDashboardToDisplayInViewMode,
} from '../helpers/edit_dashboard.js'
import {
    expectDashboardNotStarred,
    expectDashboardNotStarredWarning,
    starDashboardFails,
} from '../helpers/error_while_starring_dashboard.js'
import {
    createDashboardWithChartThatWillFail,
    removeFilter,
    visIsDisplayedCorrectly,
    errorMessageNotIncludingLinkIsDisplayedOnItem,
    errorMessageIsDisplayedOnItem,
} from '../helpers/item_chart_fails_to_render.js'
import {
    openPrintLayout,
    exitPrintMode,
    printLayoutIsDisplayed,
} from '../helpers/print.js'
import {
    resetDescriptionToBeHidden,
    clickingToShowDescriptionFails,
    warningMessageIsDisplayedStatingThatShowDescriptionFailed,
} from '../helpers/show_description.js'
import { EXTENDED_TIMEOUT, createDashboardTitle } from '../support/utils.js'

const TEST_DASHBOARD_TITLE = createDashboardTitle('0ff')

const DELIVERY_DASHBOARD_TITLE = 'Delivery'

const visitNonEditableDashboardInEditMode = () => {
    cy.intercept(`**/dashboards/${dashboards.Delivery.id}?*`, (req) => {
        req.reply((res) => {
            const noAccessResponse = Object.assign({}, res.body, {
                access: { update: false, delete: false },
            })

            res.send(noAccessResponse)
        })
    })
    cy.visit(`${dashboards.Delivery.route}/edit`, EXTENDED_TIMEOUT)
}

const onlyOptionToReturnToViewModeIsAvailable = () => {
    cy.contains('Go to dashboards', EXTENDED_TIMEOUT).should('be.visible')
    cy.contains('No access').should('be.visible')
}

const expectDashboardNotFoundMessage = () => {
    cy.contains('Requested dashboard not found', EXTENDED_TIMEOUT).should(
        'be.visible'
    )
    cy.getBySel(dashboardTitleSel).should('not.exist')
}

describe.skip('Errors while in view mode', () => {
    it('There are no dashboards', () => {
        cy.intercept('**/dashboards?*', { body: { dashboards: [] } })
        cy.visit('/', EXTENDED_TIMEOUT)
        cy.contains('No dashboards found', EXTENDED_TIMEOUT).should(
            'be.visible'
        )
        cy.getBySel(newButtonSel).should('be.visible')
    })

    it('Navigate to a dashboard that does not exist', () => {
        cy.visit('#/invalid', EXTENDED_TIMEOUT)
        expectDashboardNotFoundMessage()
        openDashboard(DELIVERY_DASHBOARD_TITLE)
        expectDashboardToDisplayInViewMode(DELIVERY_DASHBOARD_TITLE)
    })

    it('Navigate to edit dashboard that does not exist', () => {
        cy.visit('#/invalid/edit', EXTENDED_TIMEOUT)
        expectDashboardNotFoundMessage()
        openDashboard(DELIVERY_DASHBOARD_TITLE)
        expectDashboardToDisplayInViewMode(DELIVERY_DASHBOARD_TITLE)
    })

    it("Navigate to print dashboard that doesn't exist", () => {
        cy.visit('#/invalid/printoipp', EXTENDED_TIMEOUT)
        expectDashboardNotFoundMessage()
        openDashboard(DELIVERY_DASHBOARD_TITLE)
        expectDashboardToDisplayInViewMode(DELIVERY_DASHBOARD_TITLE)
    })

    it('Navigate to print layout dashboard that does not exist', () => {
        cy.visit('#/invalid/printlayout', EXTENDED_TIMEOUT)
        expectDashboardNotFoundMessage()
        openDashboard(DELIVERY_DASHBOARD_TITLE)
        expectDashboardToDisplayInViewMode(DELIVERY_DASHBOARD_TITLE)
    })

    it('Navigate to edit mode of a dashboard I do not have access to edit', () => {
        visitNonEditableDashboardInEditMode()
        onlyOptionToReturnToViewModeIsAvailable()
    })

    // FIXME
    it.skip('Starring a dashboard fails', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(DELIVERY_DASHBOARD_TITLE)
        starDashboardFails(DELIVERY_DASHBOARD_TITLE)
        expectDashboardNotStarredWarning()
        expectDashboardNotStarred()
    })

    it('View dashboard containing item that is missing type', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboardWithItemsMissingAType(DELIVERY_DASHBOARD_TITLE)
        expectDashboardToDisplayInViewMode(DELIVERY_DASHBOARD_TITLE)
        itemsMissingTypeAreDisplayedWithAWarning()
    })

    it('Edit dashboard containing item that is missing type', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboardWithItemsMissingAType(DELIVERY_DASHBOARD_TITLE)
        chooseToEditDashboard()
        itemsMissingTypeAreDisplayedWithAWarning()
        itemsCanBeDeleted()
    })

    it('Print dashboard containing item that is missing type', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboardWithItemsMissingAType(DELIVERY_DASHBOARD_TITLE)
        openPrintLayout()
        printLayoutIsDisplayed(DELIVERY_DASHBOARD_TITLE)
        itemsMissingTypeAreDisplayedWithAWarning()
    })

    // FIXME
    it.skip('Item visualization fails when filter applied', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        createDashboardWithChartThatWillFail(TEST_DASHBOARD_TITLE)
        addFilter('Diagnosis', 'Burns')
        errorMessageIsDisplayedOnItem()
        openPrintLayout()
        errorMessageNotIncludingLinkIsDisplayedOnItem()
        exitPrintMode()
        removeFilter()
        visIsDisplayedCorrectly('chart')
    })

    // FIXME
    it.skip('Item visualization fails when filter applied and viewed as table', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        addFilter('Diagnosis', 'Burns')
        errorMessageIsDisplayedOnItem()
        cy.getBySel(itemMenuButtonSel).click()
        cy.contains('View as Table').click()
        errorMessageIsDisplayedOnItem()
        removeFilter()
        visIsDisplayedCorrectly('table')
    })

    // FIXME
    it.skip('Item visualization fails when filter applied and viewed as table then viewed as chart', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        addFilter('Diagnosis', 'Burns')
        errorMessageIsDisplayedOnItem()

        cy.getBySel(itemMenuButtonSel).click()
        cy.contains('View as Table').click()

        errorMessageIsDisplayedOnItem()

        cy.getBySel(itemMenuButtonSel).click()
        cy.contains('View as Chart').click()

        errorMessageIsDisplayedOnItem()

        removeFilter()

        visIsDisplayedCorrectly('chart')
    })

    // FIXME - enable once above tests are enabled
    it.skip('delete the dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        clickViewActionButton('Edit')
        clickEditActionButton('Delete')
        cy.contains(
            `Deleting dashboard "${TEST_DASHBOARD_TITLE}" will remove it for all users`
        ).should('be.visible')

        cy.getBySel(confirmActionDialogSel)
            .find('button')
            .contains('Delete')
            .click()
        cy.getBySel(dashboardChipSel)
            .contains(TEST_DASHBOARD_TITLE)
            .should('not.exist')

        cy.getBySel(dashboardTitleSel).should('exist').should('not.be.empty')
    })

    // FIXME unflake this flaky test
    it.skip('Toggling show description fails', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(DELIVERY_DASHBOARD_TITLE)
        resetDescriptionToBeHidden()
        clickingToShowDescriptionFails()
        warningMessageIsDisplayedStatingThatShowDescriptionFailed()
        cy.getBySel(dashboardDescriptionSel).should('be.visible')
    })
})
