import { FIXED_DIMENSIONS } from '@dhis2/d2-ui-analytics';

export const SET_DIMENSIONS = 'SET_DIMENSIONS';
export const DEFAULT_DIMENSIONS = {
    pe: FIXED_DIMENSIONS.pe,
    ou: FIXED_DIMENSIONS.ou,
};

export default (state = DEFAULT_DIMENSIONS, action) => {
    switch (action.type) {
        case SET_DIMENSIONS: {
            return {
                ...DEFAULT_DIMENSIONS,
                ...action.value,
            };
        }
        default:
            return state;
    }
};

export const sGetDimensions = state => state.dimensions;
