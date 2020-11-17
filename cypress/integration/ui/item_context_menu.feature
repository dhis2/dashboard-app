Feature: Item context menu

    @nonmutating
    Scenario: I view a chart as a table
        Given I open the Delivery dashboard
        Then the Delivery dashboard displays in view mode
        And the chart dashboard item displays as a chart
        When I click View As Table on a chart dashboard item
        Then the chart dashboard item displays as a table

    @nonmutating
    Scenario: I view a chart as a map
        Given I open the Delivery dashboard
        Then the Delivery dashboard displays in view mode
        And the chart dashboard item displays as a chart
        When I click View As Map on a chart dashboard item
        Then the chart dashboard item displays as a map

    @nonmutating
    Scenario: I view a table as a chart
        Given I open the Delivery dashboard
        Then the Delivery dashboard displays in view mode
        And the table dashboard item displays as a table
        When I click View As Chart on a table dashboard item
        Then the table dashboard item displays as a chart
