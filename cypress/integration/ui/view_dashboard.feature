Feature: Viewing dashboards

    @nonmutating
    Scenario: I switch between dashboards
        Given I open the Delivery dashboard
        Then the Delivery dashboard displays in view mode
        When I select the Immunization dashboard
        Then the Immunization dashboard displays in view mode

    @nonmutating
    Scenario: I search for a dashboard
        Given I open the Delivery dashboard
        When I search for dashboards containing Immun
        Then Immunization and Immunization data dashboards are choices
        When I press enter in the search dashboard field
        Then the Immunization dashboard displays in view mode

    @nonmutating
    Scenario: I view the print layout preview
        Given I open the Delivery dashboard
        When I click to preview the print layout
        Then the print layout displays
        When I click to exit print preview
        Then the Delivery dashboard displays in view mode

    @nonmutating
    Scenario: I view the print one-item-per-page preview
        Given I open the Delivery dashboard
        When I click to preview the print one-item-per-page
        Then the print one-item-per-page displays
        When I click to exit print preview
        Then the Delivery dashboard displays in view mode

    @nonmutating
    Scenario: I view a chart as a table
            Given I open the Delivery dashboard
            Then the Delivery dashboard displays in view mode
            And the chart dashboard item displays as a chart
            When I click View As Table on a chart dashboard item
            Then the chart dashboard item displays as a table

    @nonmutating
    Scenario: I view a table as a chart
            Given I open the Delivery dashboard
            Then the Delivery dashboard displays in view mode
            And the table dashboard item displays as a table
            When I click View As Chart on a table dashboard item
            Then the table dashboard item displays as a chart
