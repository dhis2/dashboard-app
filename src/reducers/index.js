import { combineReducers } from 'redux'
import activeModalDimension from './activeModalDimension.js'
import controlBar from './controlBar.js'
import dashboards from './dashboards.js'
import dashboardsFilter from './dashboardsFilter.js'
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
import visualizations from './visualizations.js'

export default combineReducers({
    dashboards,
    selected,
    dashboardsFilter,
    controlBar,
    visualizations,
    messages,
    editDashboard,
    printDashboard,
    itemFilters,
    dimensions,
    activeModalDimension,
    passiveViewRegistered,
    showDescription,
    itemActiveTypes,
    iframePluginStatus,
})
