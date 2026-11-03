// The Individual Data Visualizer replaces Line Listing for event visualizations
const IDV_MIN_SERVER_VERSION = { minor: 43, patch: 3 }

// serverVersion is the one from useConfig, ie. { major: 2, minor: 43, patch: 3 } for 2.43.3
export const systemHasIdv = (serverVersion) => {
    const { minor, patch = 0 } = serverVersion ?? {}

    return (
        minor > IDV_MIN_SERVER_VERSION.minor ||
        (minor === IDV_MIN_SERVER_VERSION.minor &&
            patch >= IDV_MIN_SERVER_VERSION.patch)
    )
}
