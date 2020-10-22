Feature: Viewing dashboards

    Scenario: I between dashboards
        Given I open the Antenatal Care dashboard
        Then the Antenatal Care dashboard displays in view mode
        When I select the Immunization dashboard
        Then the Immunization dashboard displays in view mode
        

    Scenario: I search for a dashboard
        Given I open the Antenatal Care dashboard
        When I search for dashboards containing Immunization
        Then Immunization and Immunization data dashboards are choices
        When I press enter in the search dashboard field
        Then the Immunization dashboard displays in view mode

    Scenario: I view the print layout preview
        Given I open the Antenatal Care dashboard
        When I click to preview the print layout
        Then the print layout displays
        When I click to exit print layout
        Then the Antenatal Care dashboard displays in view mode


    

