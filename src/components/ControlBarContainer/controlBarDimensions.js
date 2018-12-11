import { END_FLAP_HEIGHT } from 'd2-ui/lib/controlbar/ControlBar';

export const CONTROL_BAR_ROW_HEIGHT = 36;
export const CONTROL_BAR_OUTER_HEIGHT_DIFF = 24;

export const getInnerHeight = rows => {
    return rows * CONTROL_BAR_ROW_HEIGHT;
};

export const getOuterHeight = (rows, expandable) => {
    const flapHeight = !expandable ? END_FLAP_HEIGHT : 0;

    return getInnerHeight(rows) + CONTROL_BAR_OUTER_HEIGHT_DIFF + flapHeight;
};
