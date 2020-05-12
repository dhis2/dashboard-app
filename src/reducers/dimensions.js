import { FIXED_DIMENSIONS } from '@dhis2/analytics';

const getDefaultDimensions = () =>
    Object.keys(FIXED_DIMENSIONS)
        .filter(dimId =>
            [FIXED_DIMENSIONS.pe.id, FIXED_DIMENSIONS.ou.id].includes(dimId)
        )
        .reduce((acc, key) => {
            const dimObj = {
                id: FIXED_DIMENSIONS[key].id,
                iconName: FIXED_DIMENSIONS[key].iconName,
                name: FIXED_DIMENSIONS[key].name(),
            };
            acc[key] = dimObj;
            return acc;
        }, {});

export const SET_DIMENSIONS = 'SET_DIMENSIONS';

const DEFAULT_DIMENSIONS = getDefaultDimensions();

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
