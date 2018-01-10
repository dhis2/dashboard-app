import { actionTypes } from '../reducers';
import { apiFetchSelected, apiPostDashboard } from '../api';
import { acSetDashboards } from './dashboards';
import { getShapedItems } from '../ItemGrid/gridUtil';

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

// thunks

export const tSetSelectedDashboardById = id => async dispatch => {
    dispatch(acSetSelectedIsLoading(true));

    const onSuccess = selected => {
        dispatch(
            acSetDashboards(
                {
                    ...selected,
                    dashboardItems: getShapedItems(selected.dashboardItems),
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
    const data = await apiPostDashboard({
        name: 'New dashboard',
    });

    console.log(data);
    dispatch(acSetSelectedId());
    dispatch(acSetSelectedEdit(true));
    dispatch(acSetSelectedIsLoading(false));
    dispatch(acSetSelectedShowDescription(true));
};
