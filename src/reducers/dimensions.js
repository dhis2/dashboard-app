import {
    getDimensionById,
    DIMENSION_ID_PERIOD,
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics';

export const SET_DIMENSIONS = 'SET_DIMENSIONS';

export const getDefaultDimensions = () =>
    [DIMENSION_ID_PERIOD, DIMENSION_ID_ORGUNIT].map(dimensionId => {
        const { id, iconName, name } = getDimensionById(dimensionId);
        return {
            id,
            iconName,
            name: name(),
        };
    });

export default (state = getDefaultDimensions(), action) => {
    switch (action.type) {
        case SET_DIMENSIONS: {
            return [...getDefaultDimensions(), ...action.value];
        }
        default:
            return state;
    }
};

export const sGetDimensions = state => state.dimensions;
