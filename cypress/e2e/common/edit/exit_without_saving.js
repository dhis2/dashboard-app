import { When } from '@badeball/cypress-cucumber-preprocessor'
import { clickEditActionButton } from '../../../elements/editDashboard.js'

When('I click Exit without saving', () => {
    clickEditActionButton('Exit without saving')
})
