import { When } from 'cypress-cucumber-preprocessor/steps'
import { clickEditActionButton } from '../../../elements/editDashboard.js'

When('I click Exit without saving', () => {
    clickEditActionButton('Exit without saving')
})
