Feature: Viewing dashboards

    @nonmutating
    Scenario: I switch between dashboards
        Given I open the "Delivery" dashboard
        When I open the "Immunization" dashboard
        Then the "Immunization" dashboard displays in view mode

    @nonmutating
    Scenario: I search for a dashboard
        Given I open the "Antenatal Care" dashboard
        When I search for dashboards containing "Immun"
        Then Immunization and Immunization data dashboards are choices
        When I click on the Immunization dashboard in the search results
        Then the "Immunization" dashboard displays in view mode

    @nonmutating
    Scenario: I search for a dashboard with nonmatching search text
        Given I open the "Antenatal Care" dashboard
        When I search for dashboards containing "Noexist"
        Then no dashboards are choices

    @nonmutating
    Scenario: I view a dashboard with items lacking shape
        Given I open the "Delivery" dashboard with shapes removed
        Then the "Delivery" dashboard displays in view mode

# @nonmutating
# Scenario: Maps with tracked entities show layer names in legend
#     Given I open the Cases Malaria dashboard
#     When I hover over the map legend button
#     Then the legend title shows the tracked entity name

    @nonmutating
    Scenario: User's preferred dashboard is opened
        Given I open the "Antenatal Care" dashboard
        When I open the dashboard app with the root url
        And I open the "Delivery" dashboard
        And I open the dashboard app with the root url
        Then the "Delivery" dashboard displays
