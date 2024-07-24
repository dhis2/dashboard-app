Feature: Editing Filter Restrictions

    @mutating
    Scenario: I create a new dashboard and have no Filter Restrictions
        Given I start a new dashboard
        And I add a dashboard title
        And I click on Filter settings
        Then Filter settings are not restricted, and I can save the dashboard

    @nonmutating
    Scenario: I change Filter Restrictions, do not confirm them, and the restrictions remain unchanged when I click back
        Given I open an existing dashboard with non-restricted Filter settings in edit mode
        And I click on Filter settings
        And I click to restrict Filter settings
        And I click away without confirming
        And I click on Filter settings
        Then Filter Restrictions are not restricted

    @nonmutating
    Scenario: I see Period and Organisation unit if newly choosing to restrict dimensions
        Given I open an existing dashboard with non-restricted Filter settings in edit mode
        And I click on Filter settings
        And I click to restrict Filter settings
        Then Period and Organisation unit are displayed as selected by default

    @nonmutating
    Scenario: I change Filter Restrictions and the changes persist while editing Filter settings
        Given I open an existing dashboard with non-restricted Filter settings in edit mode
        And I click on Filter settings
        And I click to restrict Filter settings
        And I add Facility Ownership to selected filters
        And I click to allow all filters
        And I click to restrict Filter settings
        Then Filter Restrictions are restricted and Facility Ownership is selected


    @nonmutating
    Scenario: I change Filter Restrictions and the changes persist after clicking confirm
        Given I open an existing dashboard with non-restricted Filter settings in edit mode
        And I click on Filter settings
        And I click to restrict Filter settings
        And I add Facility Ownership to selected filters
        And I click Confirm
        And I click on Filter settings
        Then Filter Restrictions are restricted and Facility Ownership is selected

    @nonmutating
    Scenario: I change Filter Restrictions and the changes do not persist if I click 'Exit without saving'
        Given I open an existing dashboard with non-restricted Filter settings in edit mode
        And I click on Filter settings
        And I click to restrict Filter settings
        And I add Facility Ownership to selected filters
        And I click Confirm
        And I click Exit without saving
        # And I confirm I want to discard changes
        Then the dashboard displays in view mode
        When I choose to edit dashboard
        And I click on Filter settings
        Then Filter Restrictions are not restricted

    @mutating
    Scenario: I change Filter Restrictions, save dashboard and can see the changes in filter dimensions panel
        Given I open an existing dashboard with non-restricted Filter settings in edit mode
        And I click on Filter settings
        And I click to restrict Filter settings
        And I remove all filters from selected filters
        And I add Facility Ownership to selected filters
        And I click Confirm
        And I save the dashboard
        And I click Add Filter
        Then I see Facility Ownership and no other dimensions

    @mutating
    Scenario: I restrict filters to no dimensions and do not see Add Filter in dashboard
        Given I open an existing dashboard with non-restricted Filter settings in edit mode
        And I click on Filter settings
        And I click to restrict Filter settings
        And I remove all filters from selected filters
        And I click Confirm
        And I save the dashboard
        Then Add Filter button is not visible
        And the dashboard displays in view mode
        When I choose to edit dashboard
        And I delete the dashboard
        Then different dashboard displays in view mode
