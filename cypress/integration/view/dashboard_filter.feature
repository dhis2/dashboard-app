Feature: Dashboard filter

    Background:
        Given I open the "Delivery" dashboard

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

    @nonmutating
    Scenario: I can access the dimensions modal from the filter badge
        Given I add a "Period" filter
        When I click on the "Period" filter badge
        Then the filter modal is opened
