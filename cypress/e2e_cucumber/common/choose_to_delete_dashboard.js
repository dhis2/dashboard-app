import { When } from '@badeball/cypress-cucumber-preprocessor'
import { clickEditActionButton } from '../../elements/editDashboard.js'

When('I choose to delete dashboard', () => {
    clickEditActionButton('Delete')
})
