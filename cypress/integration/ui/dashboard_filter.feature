Feature: Dashboard filter

    Background:
        Given I open the "Delivery" dashboard
        And the "Delivery" dashboard displays in view mode

    @nonmutating
    Scenario: I add a Period filter
        When I add a "Period" filter
        Then the Period filter is applied to the dashboard

    @nonmutating
    Scenario: I add a Organisation Unit filter
        When I add a "Organisation Unit" filter
        Then the Organisation Unit filter is applied to the dashboard

    @nonmutating
    Scenario: I add a Facility Type filter
        When I add a "Facility Type" filter
        Then the Facility Type filter is applied to the dashboard
