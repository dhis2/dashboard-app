Feature: Item context menu

    Background:
        Given I open the "Delivery" dashboard
        And the "Delivery" dashboard displays in view mode
        And the chart dashboard item displays as a chart
        And the table dashboard item displays as a table

    @nonmutating
    Scenario: View chart as table
        When I click View As Table on a chart dashboard item
        Then the chart dashboard item displays as a table

    @nonmutating
    Scenario: View chart as map
        When I click View As Map on a chart dashboard item
        Then the chart dashboard item displays as a map

    @nonmutating
    Scenario: View table as chart
        When I click View As Chart on a table dashboard item
        Then the table dashboard item displays as a chart
