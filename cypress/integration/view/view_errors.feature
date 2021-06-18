Feature: Errors while in view mode

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
    Scenario: I navigate to edit dashboard that doesn't exist
        Given I type an invalid edit dashboard id in the browser url
        Then a message displays informing that the dashboard is not found
        When I open the "Delivery" dashboard
        Then the "Delivery" dashboard displays in view mode

    # @nonmutating
    # Scenario: I navigate to print dashboard that doesn't exist
    #     Given I type an invalid print dashboard id in the browser url
    #     Then a message displays informing that the dashboard is not found
    #     When I open the "Delivery" dashboard
    #     Then the "Delivery" dashboard displays in view mode

    # @nonmutating
    # Scenario: I navigate to print layout dashboard that doesn't exist
    #     Given I type an invalid print layout dashboard id in the browser url
    #     Then a message displays informing that the dashboard is not found
    #     When I open the "Delivery" dashboard
    #     Then the "Delivery" dashboard displays in view mode


    @nonmutating
    Scenario: I enter edit mode of a dashboard I do not have access to edit
        Given I open a non-editable dashboard in edit mode
        Then only the option to return to view mode is available

    @nonmutating
    Scenario: Starring a dashboard fails
        Given I open the "Delivery" dashboard
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

# TODO unflake this flaky test
# @nonmutating
# Scenario: Toggling show description fails
#     Given I open the "Delivery" dashboard
#     When clicking to show description fails
#     Then a warning message is displayed stating that show description failed
#     And the dashboard description is not displayed
