import { DASHBOARD_WRAPPER_LR_MARGIN_PX } from './gridUtil'

const SMALL_SCREEN_BREAKPOINT = 480

export const isSmallScreen = width => width <= SMALL_SCREEN_BREAKPOINT

export const getBreakpoint = () =>
    SMALL_SCREEN_BREAKPOINT - DASHBOARD_WRAPPER_LR_MARGIN_PX
