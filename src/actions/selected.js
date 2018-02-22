import { actionTypes } from '../reducers';
import { apiFetchSelected } from '../api/dashboards';
import { acSetDashboards } from './dashboards';
import { withShape } from '../ItemGrid/gridUtil';
import { tGetMessages } from '../Item/MessagesItem/actions';
import { storePreferredDashboardId } from '../api/localStorage';
import { fromUser } from '../reducers';
import {
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
    MESSAGES,
} from '../itemTypes';
import { extractFavorite } from '../Item/PluginItem/plugin';

// actions

export const acSetSelectedId = value => ({
    type: actionTypes.SET_SELECTED_ID,
    value,
});

export const acSetSelectedIsLoading = value => ({
    type: actionTypes.SET_SELECTED_ISLOADING,
    value,
});

export const acSetSelectedShowDescription = value => ({
    type: actionTypes.SET_SELECTED_SHOWDESCRIPTION,
    value,
});

export const acNewDashboard = () => ({
    type: actionTypes.NEW_DASHBOARD,
});

export const acReceivedVisualization = value => ({
    type: actionTypes.RECEIVED_VISUALIZATION,
    value,
});

export const acReceivedActiveVisualization = (id, type, activeType) => {
    const action = {
        type: actionTypes.RECEIVED_ACTIVE_VISUALIZATION,
        id,
    };

    if (activeType !== type) {
        action.activeType = activeType;
    }

    return action;
};

// thunks

export const tSetSelectedDashboardById = id => async (dispatch, getState) => {
    dispatch(acSetSelectedIsLoading(true));

    const onSuccess = selected => {
        // update store with selected dashboard
        // withShape adds shape info to items lacking it
        // only works properly when all items in a dashboard are missing it
        // ensures that upgraded dasbboards work before they are re-saved
        dispatch(
            acSetDashboards(
                {
                    ...selected,
                    dashboardItems: withShape(selected.dashboardItems),
                },
                true
            )
        );

        // store preferred dashboard
        storePreferredDashboardId(fromUser.sGetUsername(getState()), id);

        // add visualizations to store
        selected.dashboardItems.forEach(item => {
            switch (item.type) {
                case REPORT_TABLE:
                case CHART:
                case MAP:
                case EVENT_REPORT:
                case EVENT_CHART:
                    dispatch(
                        acReceivedVisualization(
                            extractFavorite(item),
                            item.type
                        )
                    );
                    break;
                case MESSAGES:
                    dispatch(tGetMessages(id));
                    break;
                default:
                    break;
            }
        });

        // set selected dashboard
        dispatch(acSetSelectedId(id));

        // remove loading indicator
        dispatch(acSetSelectedIsLoading(false));

        return selected;
    };

    const onError = error => {
        console.log('Error: ', error);
        return error;
    };

    try {
        const fetchedSelected = await apiFetchSelected(id);

        return onSuccess(fetchedSelected);
    } catch (err) {
        return onError(err);
    }
};
