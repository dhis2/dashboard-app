Feature: Dashboard filter

    Background:
        Given I open the "Delivery" dashboard
        And the "Delivery" dashboard displays in view mode

    @nonmutating
    Scenario: I add a period filter
        When I add a period filter
        Then the period filter is applied to the dashboard

    @nonmutating
    Scenario: I add an organization unit filter
        When I add an organization unit filter
        Then the organization unit filter is applied to the dashboard


    @nonmutating
    Scenario: I add a dynamic dimension filter
        When I add a dynamic dimension filter
        Then the dynamic dimension filter is applied to the dashboard


# @nonmutating
# Scenario: I filter the list of dashboard filters
#     When I type "facility" in the filter search
#     Then filter options matching "facility" are displayed
