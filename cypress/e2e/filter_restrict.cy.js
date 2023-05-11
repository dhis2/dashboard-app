import { clickEditActionButton } from '../elements/editDashboard.js'
import {
    startNewDashboard,
    chooseToEditDashboard,
    addDashboardTitle,
    addDashboardItems,
    saveDashboard,
    expectDashboardToDisplayInViewMode,
} from '../helpers/edit_dashboard.js'
import {
    clickConfirm,
    clickFilterSettings,
    clickAddFilter,
    expectFilterRestrictionsToBeUnrestricted,
    clickAwayWithoutConfirming,
    clickToRestrictFilterSettings,
    addFacilityOwnershipToSelectedFilters,
    removeAllFiltersFromSelectedFilters,
    expectAddFilterButtonToBeInvisible,
    deleteDashboard,
    expectDifferentDashboardToDisplay,
    expectFilterRestrictionsToBeRestricted,
    expectPeriodAndOrgUnitToBeSelectedByDefault,
    clickToAllowAllFilters,
    expectFacilityOwnershipToBeOnlyDimension,
    // expectFilterSettingsToBeUnrestricted,
    visitDashboardInEditMode,
} from '../helpers/filter_restrict.js'
import { EXTENDED_TIMEOUT, createDashboardTitle } from '../support/utils.js'

const TEST_DASHBOARD_TITLE = createDashboardTitle('af')

let dashboardId

describe('Editing Filter Restrictions', () => {
    it('creates a new dashboard with no Filter Restrictions', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        startNewDashboard()
        addDashboardTitle(TEST_DASHBOARD_TITLE)
        addDashboardItems()
        clickFilterSettings()
        expectFilterRestrictionsToBeUnrestricted(TEST_DASHBOARD_TITLE)
        saveDashboard()
        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)

        cy.location().should((loc) => {
            dashboardId = loc.hash
        })
    })

    it('changes Filter Restrictions, does not confirm them, and the restrictions remain unchanged when I click back', () => {
        visitDashboardInEditMode(dashboardId)
        clickFilterSettings()
        clickToRestrictFilterSettings()
        clickAwayWithoutConfirming()
        clickFilterSettings()
        expectFilterRestrictionsToBeUnrestricted()
    })

    it('sees Period and Organisation unit if newly choosing to restrict dimensions', () => {
        visitDashboardInEditMode(dashboardId)
        clickFilterSettings()
        clickToRestrictFilterSettings()
        expectPeriodAndOrgUnitToBeSelectedByDefault()
    })

    it('changes Filter Restrictions and the changes persist while editing Filter settings', () => {
        visitDashboardInEditMode(dashboardId)
        clickFilterSettings()
        clickToRestrictFilterSettings()
        addFacilityOwnershipToSelectedFilters()
        clickToAllowAllFilters()
        clickToRestrictFilterSettings()
        expectFilterRestrictionsToBeRestricted()
    })

    it('changes Filter Restrictions and the changes persist after clicking confirm', () => {
        visitDashboardInEditMode(dashboardId)
        clickFilterSettings()
        clickToRestrictFilterSettings()
        addFacilityOwnershipToSelectedFilters()
        clickConfirm()
        clickFilterSettings()
        expectFilterRestrictionsToBeRestricted()
    })

    it('changes Filter Restrictions and the changes do not persist if I click Exit without saving', () => {
        visitDashboardInEditMode(dashboardId)
        clickFilterSettings()
        clickToRestrictFilterSettings()
        addFacilityOwnershipToSelectedFilters()
        clickConfirm()
        clickEditActionButton('Exit without saving')
        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)
        chooseToEditDashboard(TEST_DASHBOARD_TITLE)
        clickFilterSettings()
        expectFilterRestrictionsToBeUnrestricted()
    })

    it('changes Filter Restrictions, saves dashboard and can see the changes in filter dimensions panel', () => {
        visitDashboardInEditMode(dashboardId)
        clickFilterSettings()
        clickToRestrictFilterSettings()
        removeAllFiltersFromSelectedFilters()
        addFacilityOwnershipToSelectedFilters()
        clickConfirm()
        saveDashboard()
        clickAddFilter()
        expectFacilityOwnershipToBeOnlyDimension()
    })

    it('restricts filters to no dimensions and does not see Add Filter in dashboard', () => {
        visitDashboardInEditMode(dashboardId)
        clickFilterSettings()
        clickToRestrictFilterSettings()
        removeAllFiltersFromSelectedFilters()
        clickConfirm()
        saveDashboard()
        expectAddFilterButtonToBeInvisible()
        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)
    })

    // This test must be last
    it('deletes the dashboard', () => {
        visitDashboardInEditMode(dashboardId)
        deleteDashboard()
        expectDifferentDashboardToDisplay(TEST_DASHBOARD_TITLE)
    })
})
