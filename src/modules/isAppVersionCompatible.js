export const minDVVersion = [101, 0, 0]
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

export const isLLVersionCompatible = (version) =>
    isAppVersionCompatible(version, minLLVersion)

export const isMapsVersionCompatible = (version) =>
    isAppVersionCompatible(version, minMapsVersion)
