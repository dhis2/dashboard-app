Feature: Viewing dashboards

    @non-mutating
    Scenario: User switches between dashboards
        Given I open the Antenatal Care dashboard
        Then the Antenatal Care dashboard displays in view mode
        When I select the Immunization dashboard
        Then the Immunization dashboard displays in view mode


    

