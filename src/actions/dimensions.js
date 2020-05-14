import keyBy from 'lodash/keyBy';
import sortBy from 'lodash/sortBy';
import { SET_DIMENSIONS } from '../reducers/dimensions';
import { apiFetchDimensions } from '@dhis2/analytics';
import { sGetSettingsDisplayNameProperty } from '../reducers/settings';

export const acSetDimensions = dimensions => ({
    type: SET_DIMENSIONS,
    value: keyBy(sortBy(dimensions, [d => d.name.toLowerCase()]), 'id'),
});

export const tSetDimensions = d2 => async (dispatch, getState) => {
    const onSuccess = dimensions => {
        dispatch(acSetDimensions(dimensions));
    };

    const onError = error => {
        console.log('Error (apiFetchDimensions): ', error);
        return error;
    };

    try {
        const displayNameProp = sGetSettingsDisplayNameProperty(getState());
        const dimensions = await apiFetchDimensions(d2, displayNameProp);

        // filter out CATEGORY that are not of type ATTRIBUTE
        const filteredDimensions = dimensions.filter(
            dim =>
                dim.dimensionType !== 'CATEGORY' ||
                (dim.dimensionType === 'CATEGORY' &&
                    dim.dataDimensionType === 'ATTRIBUTE')
        );
        return onSuccess(filteredDimensions);
    } catch (err) {
        return onError(err);
    }
};
