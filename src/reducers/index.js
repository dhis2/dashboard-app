import { combineReducers } from 'redux'
import activeModalDimension from './activeModalDimension.js'
import dimensions from './dimensions.js'
import editDashboard from './editDashboard.js'
import iframePluginStatus from './iframePluginStatus.js'
import itemActiveTypes from './itemActiveTypes.js'
import itemFilters from './itemFilters.js'
import messages from './messages.js'
import passiveViewRegistered from './passiveViewRegistered.js'
import printDashboard from './printDashboard.js'
import selected from './selected.js'
import showDescription from './showDescription.js'
import slideshow from './slideshow.js'
import visualizations from './visualizations.js'

export default combineReducers({
    selected,
    visualizations,
    messages,
    editDashboard,
    printDashboard,
    itemFilters,
    dimensions,
    activeModalDimension,
    passiveViewRegistered,
    showDescription,
    slideshow,
    itemActiveTypes,
    iframePluginStatus,
})
