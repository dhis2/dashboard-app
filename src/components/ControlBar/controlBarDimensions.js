import { END_FLAP_HEIGHT } from '@dhis2/d2-ui-core/control-bar/ControlBar';
import { SHOWMORE_BAR_HEIGHT } from './ShowMoreButton';

export const CONTROL_BAR_ROW_HEIGHT = 36;
export const FIRST_ROW_PADDING_HEIGHT = 10;
export const HEADERBAR_HEIGHT = 48;

export const MIN_ROW_COUNT = 1;

const CONTROL_BAR_OUTER_HEIGHT_DIFF =
    FIRST_ROW_PADDING_HEIGHT + SHOWMORE_BAR_HEIGHT - 2; // 2 pixel "adjustment"

export const getRowsHeight = rows => {
    return rows * CONTROL_BAR_ROW_HEIGHT;
};

export const getNumRowsFromHeight = height => {
    return Math.floor(
        (height - CONTROL_BAR_OUTER_HEIGHT_DIFF) / CONTROL_BAR_ROW_HEIGHT
    );
};

export const getControlBarHeight = (rows, expandable) => {
    const flapHeight = !expandable ? END_FLAP_HEIGHT : 0;

    return getRowsHeight(rows) + CONTROL_BAR_OUTER_HEIGHT_DIFF + flapHeight;
};
