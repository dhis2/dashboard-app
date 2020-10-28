Feature: Viewing dashboards

    Scenario: I view the print layout preview
        Given I open the Antenatal Care dashboard
        When I click to preview the print layout
        Then the print layout displays
        When I click to exit print preview
        Then the Antenatal Care dashboard displays in view mode

    Scenario: I view the print one-item-per-page preview
        Given I open the Antenatal Care dashboard
        When I click to preview the print one-item-per-page
        Then the print one-item-per-page displays
        When I click to exit print preview
        Then the Antenatal Care dashboard displays in view mode
