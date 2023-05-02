// TODO handle plugin version matrix in a better way
export const minLLVersion = [100, 6, 0]

export const isLLVersionCompatible = (version) => {
    const versionArray = version.split('.').map((el) => parseInt(el, 10))

    const isCompatible =
        minLLVersion[0] <= versionArray[0] &&
        minLLVersion[1] <= versionArray[1] &&
        minLLVersion[2] <= versionArray[2]

    return isCompatible
}
