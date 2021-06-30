Feature: Error scenarios

    @nonmutating
    Scenario: There are no dashboards
        Given I open an app with no dashboards
        Then a message displays informing that there are no dashboards

    @nonmutating
    Scenario: I navigate to a dashboard that doesn't exist or I don't have access to
        Given I type an invalid dashboard id in the browser url
        Then a message displays informing that the dashboard is not found
        When I open the "Delivery" dashboard
        Then the "Delivery" dashboard displays in view mode

    @nonmutating
    Scenario: An error occurs while saving a dashboard that I don't have access to
        Given I open the "Delivery" dashboard
        When I choose to edit dashboard
        And I save dashboard that I don't have access to save
        Then I remain in edit mode and error message is displayed

    @nonmutating
    Scenario: A 500 error is thrown when I save the dashboard
        Given I open the "Delivery" dashboard
        When I choose to edit dashboard
        And A 500 error is thrown when I save the dashboard
        Then I remain in edit mode and error message is displayed

    @nonmutating
    Scenario: I enter edit mode of a dashboard I do not have access to edit
        Given I open a non-editable dashboard in edit mode
        Then only the option to return to view mode is available

    @nonmutating
    Scenario: Starring a dashboard fails
        Given I open the "Delivery" dashboard
        Then the "Delivery" dashboard displays in view mode
        When clicking to star "Delivery" dashboard fails
        Then a warning message is displayed stating that starring dashboard failed
        And the "Delivery" dashboard is not starred

    Scenario: View dashboard containing item that is missing type
        Given I open the Delivery dashboard with items missing a type
        Then the "Delivery" dashboard displays in view mode
        And the items missing type are displayed with a warning

    Scenario: Edit dashboard containing item that is missing type
        Given I open the Delivery dashboard with items missing a type
        When I choose to edit dashboard
        Then the items missing type are displayed with a warning
        And I can delete the items

    Scenario: Print dashboard containing item that is missing type
        Given I open the Delivery dashboard with items missing a type
        When I click to preview the print layout
        Then the print layout displays for "Delivery" dashboard
        And the items missing type are displayed with a warning

    Scenario: Item visualization fails when filter applied [DHIS2-11303]
        Given I create a dashboard with a chart that will fail
        When I apply a "Diagnosis" filter of type "Burns"
        Then an error message is displayed on the item
        When I click to preview the print layout
        Then an error message not including a link is displayed on the item
        When I click to exit print preview
        And I remove the filter
        Then the "chart" is displayed correctly

    Scenario: Item visualization fails when filter applied and viewed as table [DHIS2-11303]
        Given I open a dashboard with a chart that will fail
        When I apply a "Diagnosis" filter of type "Burns"
        Then an error message is displayed on the item
        When I view as table
        Then an error message is displayed on the item
        When I remove the filter
        Then the "table" is displayed correctly

    Scenario: Item visualization fails when filter applied and viewed as table then viewed as chart [DHIS2-11303]
        Given I open a dashboard with a chart that will fail
        When I apply a "Diagnosis" filter of type "Burns"
        Then an error message is displayed on the item
        When I view as table
        Then an error message is displayed on the item
        When I view as chart
        Then an error message is displayed on the item
        When I remove the filter
        Then the "chart" is displayed correctly
        And I delete the dashboard

# TODO unflake this flaky test
# @nonmutating
# Scenario: Toggling show description fails
#     Given I open the "Delivery" dashboard
#     Then the "Delivery" dashboard displays in view mode
#     When clicking to show description fails
#     Then a warning message is displayed stating that show description failed
#     And the dashboard description is not displayed



