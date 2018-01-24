import { generateUid } from 'd2/lib/uid';
import { actionTypes } from '../reducers';
import { apiFetchSelected, apiPostDashboard } from '../api';
import { acSetDashboards, tSetDashboards } from './dashboards';
import { withShape } from '../ItemGrid/gridUtil';
import { tGetMessages } from '../Item/MessagesItem/actions';
import {
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
    MESSAGES,
} from '../util';

// actions

export const acSetSelectedId = value => ({
    type: actionTypes.SET_SELECTED_ID,
    value,
});

export const acSetSelectedEdit = value => ({
    type: actionTypes.SET_SELECTED_EDIT,
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

export const receivedVisualization = value => ({
    type: actionTypes.RECEIVED_VISUALIZATION,
    value,
});

// thunks

export const tSetSelectedDashboardById = id => async dispatch => {
    dispatch(acSetSelectedIsLoading(true));

    const onSuccess = selected => {
        selected.dashboardItems.forEach(item => {
            switch (item.type) {
                case REPORT_TABLE:
                    dispatch(receivedVisualization(item.reportTable));
                    break;
                case CHART:
                    dispatch(receivedVisualization(item.chart));
                    break;
                case MAP:
                    dispatch(receivedVisualization(item.map));
                    break;
                case EVENT_REPORT:
                    dispatch(receivedVisualization(item.eventReport));
                    break;
                case EVENT_CHART:
                    dispatch(receivedVisualization(item.eventChart));
                    break;
                case MESSAGES:
                    dispatch(tGetMessages(id));
                    break;
                default:
                    break;
            }
        });

        dispatch(
            acSetDashboards(
                {
                    ...selected,
                    dashboardItems: withShape(selected.dashboardItems), // TODO get shape from backend instead
                },
                true
            )
        );
        dispatch(acSetSelectedId(id));
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

export const tNewDashboard = () => async dispatch => {
    const id = generateUid();
    const date = new Date();

    await apiPostDashboard({
        id: id,
        name: `Created by user (${date
            .toJSON()
            .replace('T', ', ')
            .substr(0, 17)})`,
    });

    await dispatch(tSetDashboards());

    await dispatch(tSetSelectedDashboardById(id));

    dispatch(acSetSelectedEdit(true));

    // dispatch(tSetDashboards()).then(() => {
    //     dispatch(acSetSelectedEdit(true));
    //     dispatch(tSetSelectedDashboardById(id));
    // });
};
