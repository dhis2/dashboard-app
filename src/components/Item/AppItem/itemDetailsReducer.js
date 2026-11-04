// plugins without an app entrypoint have no launchUrl, so there is nothing to
// open in a standalone app - keep appUrl undefined rather than stringifying
// "undefined" into a broken href (DHIS2-21739)
export const createItemDetailsReducer = (appDetails) => (state, newState) => ({
    ...state,
    ...newState,
    appUrl: appDetails?.launchUrl
        ? `${appDetails.launchUrl}${newState.appUrl ?? ''}`
        : undefined,
})
