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
        When I press enter in the search dashboard field
        Then the "Immunization" dashboard displays in view mode

    @nonmutating
    Scenario: I search for a dashboard with nonmatching search text
        Given I open the "Antenatal Care" dashboard
        When I search for dashboards containing "Noexist"
        Then no dashboards are choices
        When I press enter in the search dashboard field
        Then dashboards list restored and dashboard is still "Antenatal Care"

    @nonmutating
    Scenario: I view the print layout preview
        Given I open the "Delivery" dashboard
        When I click to preview the print layout
        Then the print layout displays for "Delivery" dashboard
        When I click to exit print preview
        Then the "Delivery" dashboard displays in view mode

    @nonmutating
    Scenario: I view the print one-item-per-page preview
        Given I open the "Delivery" dashboard
        When I click to preview the print one-item-per-page
        Then the print one-item-per-page displays for "Delivery" dashboard
        When I click to exit print preview
        Then the "Delivery" dashboard displays in view mode

    @nonmutating
    Scenario: I view a dashboard with items lacking shape
        Given I open the "Delivery" dashboard with shapes removed
        Then the "Delivery" dashboard displays in view mode



# TODO: flaky test
# @mutating
# Scenario: I change the height of the control bar
#     Given I open the "Delivery" dashboard
#     When I drag to increase the height of the control bar
#     Then the control bar height should be updated

# TODO: flaky test
# @mutating
# Scenario: I change the height of an expanded control bar
#     Given I open the "Delivery" dashboard
#     When I toggle show more dashboards
#     And I drag to decrease the height of the control bar
#     Then the control bar height should be updated
