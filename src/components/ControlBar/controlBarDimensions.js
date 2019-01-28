import { END_FLAP_HEIGHT } from '@dhis2/d2-ui-core/control-bar/ControlBar';

export const CONTROL_BAR_ROW_HEIGHT = 46;
export const CONTROL_BAR_OUTER_HEIGHT_DIFF = 14;

export const getInnerHeight = rows => {
    return rows * CONTROL_BAR_ROW_HEIGHT;
};

export const getOuterHeight = (rows, expandable) => {
    const flapHeight = !expandable ? END_FLAP_HEIGHT : 0;

    return getInnerHeight(rows) + CONTROL_BAR_OUTER_HEIGHT_DIFF + flapHeight;
};
