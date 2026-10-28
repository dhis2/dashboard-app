// These authorities grant access to all apps (see DefaultAppManager.isAccessible in dhis2-core).
// In 2.40 and 2.41 the app management authority doesn't grant access to bundled apps,
// which then show the JSON error as before.
const ALL_APPS_AUTHORITIES = ['ALL', 'M_dhis-web-app-management']

// The app authority is not available for apps the user has no access to,
// as they are not listed in api/apps, so it's derived from the app key
// (see App.getUrlFriendlyName and App.getSeeAppAuthority in dhis2-core):
// - bundled apps: M_dhis-web-<key>
// - installed apps: M_ + short name without non-alphanumeric characters, and whitespace replaced by _
// The key is the short name without non-alphanumeric characters except hyphens,
// and whitespace replaced by -, so each - in the key is either removed or a _ in the authority.
const getAppAuthorityRegExp = (appKey) => {
    // keys only contain alphanumeric characters and hyphens, but escape anyway
    const escapedKey = appKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    return new RegExp(
        `^M_(dhis-web-${escapedKey}|${escapedKey.split('-').join('_?')})$`
    )
}

export const hasAppAccess = (appKey, authorities = []) => {
    if (!appKey) {
        return true
    }

    const appAuthorityRegExp = getAppAuthorityRegExp(appKey)

    return authorities.some(
        (authority) =>
            ALL_APPS_AUTHORITIES.includes(authority) ||
            appAuthorityRegExp.test(authority)
    )
}
