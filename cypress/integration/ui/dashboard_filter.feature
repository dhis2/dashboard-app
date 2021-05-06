Feature: Dashboard filter

    Scenario: I add a Period filter
        When I choose to create new dashboard
        And I add a MAP and a CHART and save
        Then the dashboard displays in view mode
        When I add a "Period" filter
        Then the Period filter is applied to the dashboard

    Scenario: I add a Organisation Unit filter
        Given I open existing dashboard
        When I add a "Organisation Unit" filter
        Then the Organisation Unit filter is applied to the dashboard

    Scenario: I add a Facility Type filter
        Given I open existing dashboard
        When I add a "Facility Type" filter
        Then the Facility Type filter is applied to the dashboard

    Scenario: I can access the dimensions modal from the filter badge
        Given I open existing dashboard
        When I add a "Period" filter
        And I click on the "Period" filter badge
        Then the filter modal is opened

    Scenario: I delete a dashboard
        Given I open existing dashboard
        When I choose to edit dashboard
        And I choose to delete dashboard
        When I confirm delete
        Then different dashboard displays in view mode
