import { END_FLAP_HEIGHT } from '@dhis2/d2-ui-core/control-bar/ControlBar';

export const CONTROL_BAR_ROW_HEIGHT = 36;
export const CONTROL_BAR_OUTER_HEIGHT_DIFF = 24;
export const FIRST_ROW_PADDING_HEIGHT = 10;
export const HEADER_BAR_HEIGHT = 48;

export const getRowsHeight = rows => {
    return rows * CONTROL_BAR_ROW_HEIGHT; // + FIRST_ROW_PADDING_HEIGHT;
};

export const getControlBarHeight = (rows, expandable) => {
    const flapHeight = !expandable ? END_FLAP_HEIGHT : 0;

    // const res =
    //     getInnerHeight(rows) + CONTROL_BAR_OUTER_HEIGHT_DIFF + flapHeight;

    // console.log(
    //     getInnerHeight(rows),
    //     '+',
    //     CONTROL_BAR_OUTER_HEIGHT_DIFF,
    //     '+',
    //     flapHeight,
    //     '=',
    //     res
    // );

    return getRowsHeight(rows) + CONTROL_BAR_OUTER_HEIGHT_DIFF + flapHeight;
};
