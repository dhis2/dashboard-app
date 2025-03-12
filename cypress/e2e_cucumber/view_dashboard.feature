Feature: Viewing dashboards

    @nonmutating
    Scenario: I view the print layout preview and then print one-item-per-page preview
        Given I open the "Delivery" dashboard
        When I click to preview the print layout
        Then the print layout displays for "Delivery" dashboard
        When I click to exit print preview
        Then the "Delivery" dashboard displays in view mode
        When I click to preview the print one-item-per-page
        Then the print one-item-per-page displays for "Delivery" dashboard
        When I click to exit print preview
        Then the "Delivery" dashboard displays in view mode

# @nonmutating
# FIXME
# Scenario: Maps with tracked entities show layer names in legend
#     Given I open the Cases Malaria dashboard
#     When I hover over the map legend button
#     Then the legend title shows the tracked entity name
