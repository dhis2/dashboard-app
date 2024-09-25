// TODO handle plugin version matrix in a better way
export const minLLVersion = [100, 6, 0]

export const isLLVersionCompatible = (version) => {
    const versionArray = version.split('.').map((el) => parseInt(el, 10))

    const [minMajor, minMinor, minPatch] = minLLVersion
    const [major, minor, patch] = versionArray

    const isCompatible =
        major > minMajor ||
        (major === minMajor && minor > minMinor) ||
        (major === minMajor && minor === minMinor && patch >= minPatch)

    return isCompatible
}
