import { combineReducers } from 'redux';
import arraySort from 'd2-utilizr/lib/arraySort';

import dashboards, { sGetDashboardsRoot } from './dashboards';
import selected from './selected';
import dashboardsFilter, {
    ownerData,
    sGetFilterName,
    sGetFilterOrder,
    sGetFilterOwner,
} from './dashboardsFilter';
import controlBar from './controlBar';
import interpretations from './interpretations';
import visualizations from './visualizations';
import editDashboard from './editDashboard';
import messages from './messages';
import user from './user';
import snackbar from './snackbar';
import itemFilter from './itemFilter';
import style from './style';

const USER = 'system';

// Reducers

export default combineReducers({
    dashboards,
    selected,
    dashboardsFilter,
    controlBar,
    interpretations,
    visualizations,
    messages,
    user,
    editDashboard,
    itemFilter,
    style,
    snackbar,
});

// Map constants to data
const mapConstToData = {
    NAME: 'name',
    ITEMS: 'numberOfItems',
    CREATED: 'created',
    OWNER: 'owner',
};

// Selectors

// Filter dashboards by name
export const sFilterDashboardsByName = (dashboards, filter) =>
    dashboards.filter(d =>
        d.displayName.toLowerCase().includes(filter.toLowerCase())
    );

// Filter dashboards by owner, TODO FIXME
export const sFilterDashboardsByOwner = (dashboards, filter) => {
    const ME = ownerData[1]; // TODO
    const OTHERS = ownerData[2]; // TODO

    switch (filter) {
        case ME:
            return dashboards.filter(d => d.owner === USER);
        case OTHERS:
            return dashboards.filter(d => d.owner !== USER);
        default:
            return dashboards;
    }
};

// Filter dashboards by order
export const sFilterDashboardsByOrder = (dashboards, filter) => {
    const filterValues = filter.split(':');

    const key = filterValues[0];
    const direction = filterValues[1];

    return arraySort(dashboards, direction, mapConstToData[key]);
};

// Selectors dependency level 2

// Get filtered dashboards
export const sGetFilteredDashboards = state => {
    const dashboards = sGetDashboardsRoot(state);

    const nameFilter = sGetFilterName(state);
    const ownerFilter = sGetFilterOwner(state);
    const orderFilter = sGetFilterOrder(state);

    return sFilterDashboardsByOrder(
        sFilterDashboardsByName(
            sFilterDashboardsByOwner(dashboards, ownerFilter),
            nameFilter
        ),
        orderFilter
    );
};
