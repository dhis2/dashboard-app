// TODO handle plugin version matrix in a better way
export const minDVVersion = [100, 8, 1]
export const minLLVersion = [101, 1, 9]
export const minMapsVersion = [100, 7, 1]

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
