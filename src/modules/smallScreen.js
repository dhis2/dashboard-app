const SMALL_SCREEN_BREAKPOINT = 480

export const isSmallScreen = (width) => width <= SMALL_SCREEN_BREAKPOINT

export const getBreakpoint = (containerWidth) =>
    SMALL_SCREEN_BREAKPOINT - (window.innerWidth - containerWidth)
