import { dashboards } from '../assets/backends/sierraLeone_236.js'
import {
    itemMenuButtonSel,
    // getDashboardItem,
    // gridItemSel,
    // mapSel,
} from '../elements/dashboardItem.js'
import {
    // showMoreLessSel,
    newButtonSel,
    dashboardDescriptionSel,
    dashboardTitleSel,
    dashboardChipSel,
    // dashboardSearchInputSel,
} from '../elements/viewDashboard.js'
import {
    openDashboardWithItemsMissingAType,
    itemsMissingTypeAreDisplayedWithAWarning,
    itemsCanBeDeleted,
} from '../helpers/dashboard_item_missing_type.js'
import {
    expectDashboardNotStarred,
    expectDashboardNotStarredWarning,
    starDashboardFails,
} from '../helpers/error_while_starring_dashboard.js'
import { exitPrintLayout } from '../helpers/exit_print_layout.js'
import { chooseToEditDashboard } from '../helpers/helpers2.js'
import {
    createDashboardWithChartThatWillFail,
    deleteDashboard,
    removeFilter,
    visIsDisplayedCorrectly,
    errorMessageNotIncludingLinkIsDisplayedOnItem,
    errorMessageIsDisplayedOnItem,
    addFilterOfType,
} from '../helpers/item_chart_fails_to_render.js'
import { openPrintLayout } from '../helpers/open_print_layout.js'
import { openSLDashboard } from '../helpers/open_the_SL_dashboard.js'
// import { openPrintOipp, printOippIsDisplayed } from '../helpers/print.js'
import { printLayoutIsDisplayed } from '../helpers/print_layout_displays.js'
import {
    resetDescriptionToBeHidden,
    clickingToShowDescriptionFails,
    warningMessageIsDisplayedStatingThatShowDescriptionFailed,
} from '../helpers/show_description.js'
import { expectSLDashboardToDisplayInViewMode } from '../helpers/SL_dashboard_displays_in_view_mode.js'
import { EXTENDED_TIMEOUT, createDashboardTitle } from '../support/utils.js'

const TEST_DASHBOARD_TITLE = createDashboardTitle('0ff')

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

const openDashboard = (title) => {
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT).contains(title).click()
    cy.get(dashboardTitleSel).contains(title).should('be.visible')
}

const expectDashboardNotFoundMessage = () => {
    cy.contains('Requested dashboard not found', EXTENDED_TIMEOUT).should(
        'be.visible'
    )
    cy.get(dashboardTitleSel).should('not.exist')
}

describe('Errors while in view mode', () => {
    it('There are no dashboards', () => {
        cy.intercept('**/dashboards?*', { body: { dashboards: [] } })
        cy.visit('/', EXTENDED_TIMEOUT)
        cy.contains('No dashboards found', EXTENDED_TIMEOUT).should(
            'be.visible'
        )
        cy.get(newButtonSel).should('be.visible')
    })

    it('Navigate to a dashboard that does not exist', () => {
        cy.visit('#/invalid', EXTENDED_TIMEOUT)
        expectDashboardNotFoundMessage()
        openSLDashboard('Delivery')
        expectSLDashboardToDisplayInViewMode('Delivery')
    })

    it('Navigate to edit dashboard that does not exist', () => {
        cy.visit('#/invalid/edit', EXTENDED_TIMEOUT)
        expectDashboardNotFoundMessage()
        openSLDashboard('Delivery')
        expectSLDashboardToDisplayInViewMode('Delivery')
    })

    it("Navigate to print dashboard that doesn't exist", () => {
        cy.visit('#/invalid/printoipp', EXTENDED_TIMEOUT)
        expectDashboardNotFoundMessage()
        openSLDashboard('Delivery')
        expectSLDashboardToDisplayInViewMode('Delivery')
    })

    it('Navigate to print layout dashboard that does not exist', () => {
        cy.visit('#/invalid/printlayout', EXTENDED_TIMEOUT)
        expectDashboardNotFoundMessage()
        openSLDashboard('Delivery')
        expectSLDashboardToDisplayInViewMode('Delivery')
    })

    it('Navigate to edit mode of a dashboard I do not have access to edit', () => {
        visitNonEditableDashboardInEditMode()
        onlyOptionToReturnToViewModeIsAvailable()
    })

    // FIXME
    it.skip('Starring a dashboard fails', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openSLDashboard('Delivery')
        starDashboardFails('Delivery')
        expectDashboardNotStarredWarning()
        expectDashboardNotStarred()
    })

    it('View dashboard containing item that is missing type', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboardWithItemsMissingAType('Delivery')
        expectSLDashboardToDisplayInViewMode('Delivery')
        itemsMissingTypeAreDisplayedWithAWarning()
    })

    it('Edit dashboard containing item that is missing type', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboardWithItemsMissingAType('Delivery')
        chooseToEditDashboard()
        itemsMissingTypeAreDisplayedWithAWarning()
        itemsCanBeDeleted()
    })

    it('Print dashboard containing item that is missing type', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboardWithItemsMissingAType('Delivery')
        openPrintLayout()
        printLayoutIsDisplayed('Delivery')
        itemsMissingTypeAreDisplayedWithAWarning()
    })

    // FIXME
    it.skip('Item visualization fails when filter applied', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        createDashboardWithChartThatWillFail(TEST_DASHBOARD_TITLE)
        addFilterOfType('Diagnosis', 'Burns')
        errorMessageIsDisplayedOnItem()
        openPrintLayout()
        errorMessageNotIncludingLinkIsDisplayedOnItem()
        exitPrintLayout()
        removeFilter()
        visIsDisplayedCorrectly('chart')
    })

    // FIXME
    it.skip('Item visualization fails when filter applied and viewed as table', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        addFilterOfType('Diagnosis', 'Burns')
        errorMessageIsDisplayedOnItem()
        cy.get(itemMenuButtonSel).click()
        cy.contains('View as Table').click()
        errorMessageIsDisplayedOnItem()
        removeFilter()
        visIsDisplayedCorrectly('table')
    })

    // FIXME
    it.skip('Item visualization fails when filter applied and viewed as table then viewed as chart', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        addFilterOfType('Diagnosis', 'Burns')
        errorMessageIsDisplayedOnItem()

        cy.get(itemMenuButtonSel).click()
        cy.contains('View as Table').click()

        errorMessageIsDisplayedOnItem()

        cy.get(itemMenuButtonSel).click()
        cy.contains('View as Chart').click()

        errorMessageIsDisplayedOnItem()

        removeFilter()

        visIsDisplayedCorrectly('chart')
    })

    // FIXME - enable once above tests are enabled
    it.skip('delete the dashboard that was created for this test suite', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        deleteDashboard(TEST_DASHBOARD_TITLE)
    })

    // FIXME unflake this flaky test
    it.skip('Toggling show description fails', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openSLDashboard('Delivery')
        resetDescriptionToBeHidden()
        clickingToShowDescriptionFails()
        warningMessageIsDisplayedStatingThatShowDescriptionFailed()
        cy.get(dashboardDescriptionSel).should('be.visible')
    })
})
