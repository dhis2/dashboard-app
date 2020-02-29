import {
    SET_SELECTED_ID,
    SET_SELECTED_ISLOADING,
    SET_SELECTED_SHOWDESCRIPTION,
} from '../reducers/selected';
import { acAddVisualization } from '../actions/visualizations';
import { acSetCurrentVisualizationView } from '../actions/currentVisualizationViews';
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
import { MESSAGES, isVisualizationType } from '../modules/itemTypes';
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

export const tLoadDashboard = id => async dispatch => {
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
            if (isVisualizationType(item)) {
                const visualization = extractFavorite(item);
                dispatch(acAddVisualization(visualization));
                dispatch(
                    acSetCurrentVisualizationView(
                        visualization.id,
                        visualization
                    )
                );
            }

            if (item.type === MESSAGES) {
                dispatch(tGetMessages(id));
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
