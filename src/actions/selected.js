import {
    SET_SELECTED_ID,
    SET_SELECTED_ISLOADING,
    SET_SELECTED_SHOWDESCRIPTION,
} from '../reducers/selected';
import {
    RECEIVED_VISUALIZATION,
    RECEIVED_ACTIVE_VISUALIZATION,
} from '../reducers/visualizations';
import { sGetSelectedIsLoading } from '../reducers/selected';
import { sGetUserUsername } from '../reducers/user';
import { getCustomDashboards, sGetDashboardById } from '../reducers/dashboards';
import { apiFetchDashboard } from '../api/dashboards';
import { acSetDashboardItems, acAppendDashboards } from './dashboards';
import { withShape } from '../components/ItemGrid/gridUtil';
import { tGetMessages } from '../components/Item/MessagesItem/actions';
import { acReceivedSnackbarMessage, acCloseSnackbar } from './snackbar';
import { storePreferredDashboardId } from '../api/localStorage';
import { loadingDashboardMsg } from '../components/SnackbarMessage/SnackbarMessage';
import {
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
    MESSAGES,
} from '../modules/itemTypes';
import { extractFavorite } from '../components/Item/VisualizationItem/plugin';
import { orObject } from '../modules/util';

// actions

export const acSetSelectedId = value => ({
    type: SET_SELECTED_ID,
    value,
});

export const acSetSelectedIsLoading = value => ({
    type: SET_SELECTED_ISLOADING,
    value,
});

export const acSetSelectedShowDescription = value => ({
    type: SET_SELECTED_SHOWDESCRIPTION,
    value,
});

export const acReceivedVisualization = value => ({
    type: RECEIVED_VISUALIZATION,
    value,
});

export const acReceivedActiveVisualization = (id, type, activeType) => {
    const action = {
        type: RECEIVED_ACTIVE_VISUALIZATION,
        id,
    };

    if (activeType !== type) {
        action.activeType = activeType;
    }

    return action;
};

export const tLoadDashboard = id => async (dispatch, getState) => {
    try {
        const dash = await apiFetchDashboard(id);
        dispatch(acAppendDashboards(dash));

        return Promise.resolve(dash);
    } catch (err) {
        console.log('Error: ', err);
        return err;
    }
};

// thunks
export const tSetSelectedDashboardById = id => async (dispatch, getState) => {
    dispatch(acSetSelectedIsLoading(true));

    const snackbarTimeout = setTimeout(() => {
        const dashboardName = orObject(sGetDashboardById(getState(), id))
            .displayName;
        if (sGetSelectedIsLoading(getState()) && dashboardName) {
            loadingDashboardMsg.name = dashboardName;

            dispatch(
                acReceivedSnackbarMessage({
                    message: loadingDashboardMsg,
                    open: true,
                })
            );
        }
    }, 500);

    const onSuccess = selected => {
        const customDashboard = getCustomDashboards(selected)[0];

        dispatch(
            acSetDashboardItems(withShape(customDashboard.dashboardItems))
        );

        storePreferredDashboardId(sGetUserUsername(getState()), id);

        // add visualizations to store
        customDashboard.dashboardItems.forEach(item => {
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

        dispatch(acSetSelectedId(id));

        dispatch(acSetSelectedIsLoading(false));

        clearTimeout(snackbarTimeout);

        dispatch(acCloseSnackbar());

        return selected;
    };

    const onError = error => {
        console.log('Error: ', error);
        return error;
    };

    try {
        const selected = await dispatch(tLoadDashboard(id));

        return onSuccess(selected);
    } catch (err) {
        return onError(err);
    }
};
