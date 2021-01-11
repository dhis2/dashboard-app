Feature: Item context menu fullscreen

    Background:
        Given I open the "Antenatal Care" dashboard
        And the "Antenatal Care" dashboard displays in view mode

    @nonmutating
    Scenario: Text item does not have a context menu
        Then the text item does not have a context menu

    @nonmutating
    Scenario: Chart item has a fullscreen option
        Then the chart item has a fullscreen option in the context menu


