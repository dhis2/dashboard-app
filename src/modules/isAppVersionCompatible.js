// Minimum DHIS2 api version that returns PIVOT_TABLE event visualizations and bundles the EVER app
export const MIN_API_VERSION_FOR_EVER = 43

// Minimum installed app versions required for the various dashboard item to render correctly
export const minDVVersion = [101, 0, 0]
export const minEVERVersion = [101, 0, 0]
export const minLLVersion = [102, 0, 0]
export const minMapsVersion = [101, 0, 0]

const isAppVersionCompatible = (version, minVersion) => {
    const [major, minor, patch] = version
        .split('.')
        .map((el) => parseInt(el, 10))

    const [minMajor, minMinor, minPatch] = minVersion

    const isCompatible =
        major > minMajor ||
        (major === minMajor && minor > minMinor) ||
        (major === minMajor && minor === minMinor && patch >= minPatch)

    return isCompatible
}

export const isDVVersionCompatible = (version) =>
    isAppVersionCompatible(version, minDVVersion)

export const isEVERVersionCompatible = (version) =>
    isAppVersionCompatible(version, minEVERVersion)

export const isLLVersionCompatible = (version) =>
    isAppVersionCompatible(version, minLLVersion)

export const isMapsVersionCompatible = (version) =>
    isAppVersionCompatible(version, minMapsVersion)
