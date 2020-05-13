import { FIXED_DIMENSIONS } from '@dhis2/analytics';

const getDefaultDimensions = () =>
    Object.keys(FIXED_DIMENSIONS)
        .filter(dimId =>
            [FIXED_DIMENSIONS.pe.id, FIXED_DIMENSIONS.ou.id].includes(dimId)
        )
        .reduce((acc, key) => {
            acc[key] = {
                id: FIXED_DIMENSIONS[key].id,
                iconName: FIXED_DIMENSIONS[key].iconName,
                name: FIXED_DIMENSIONS[key].name(),
            };

            return acc;
        }, {});

export const SET_DIMENSIONS = 'SET_DIMENSIONS';

export default (state = getDefaultDimensions(), action) => {
    switch (action.type) {
        case SET_DIMENSIONS: {
            return {
                ...getDefaultDimensions(),
                ...action.value,
            };
        }
        default:
            return state;
    }
};

export const sGetDimensions = state => state.dimensions;
