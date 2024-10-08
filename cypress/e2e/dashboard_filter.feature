Feature: Dashboard filter

    Scenario: I add and remove filters
        When I start a new dashboard
        And I add items and save
        Then the dashboard displays in view mode and visualizations are visible
        When I add a "Period" filter
        Then the Period filter is applied to the dashboard
        When I remove the "Period" filter
        Then the filter is removed from the dashboard
        When I add a "Organisation unit" filter
        Then the Organisation unit filter is applied to the dashboard
        When I remove the "OrgUnit" filter
        Then the filter is removed from the dashboard
        When I add a "Facility Type" filter
        Then the Facility Type filter is applied to the dashboard

    Scenario: I add a Org unit group filter
        Given I open an existing dashboard
        Then the dashboard displays in view mode and visualizations are visible
        When I add a "Org unit group" filter
        Then the Org unit group filter is applied to the dashboard

    Scenario: I can access the dimensions modal from the filter badge
        Given I open an existing dashboard
        When I add a "Period" filter
        And I click on the "Period" filter badge
        Then the filter modal is opened

    Scenario: I delete a dashboard
        Given I open an existing dashboard
        When I choose to edit dashboard
        And I choose to delete dashboard
        When I confirm delete
        Then different dashboard displays in view mode
