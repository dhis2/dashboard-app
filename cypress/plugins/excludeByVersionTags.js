const { tagify } = require('cypress-tags')
const d2config = require('../../d2.config.js')
/*
The list of excluded tags returned by getExcludedTags are the tags that cypress will ignore when running the test suite. So if a test is tagged with one of the tags in the excluded list, then that test will not run.

Using excluded tags (instead of included tags) allows for most of the tests to remain untagged and be run against all supported versions of DHIS2.

DHIS2 officially supports the latest 3 released versions of DHIS2. For example: 2.38, 2.39 and 2.40. Dev would then have version 2.41-SNAPSHOT. Therefore, the getExcludedTags calculates the range of tags based on minimum supported version + 3 (2.38, 2.39, 2.40, 2.41-SNAPSHOT)

With the minimum supported version of 2.38, the tags will always contain "38", "39", "40" and "41", but the comparison symbols will depend on the current instance version.

Allowed tag comparisons are ">", ">=", "<", "<="
*/

const getString = (v) => (typeof v === 'number' ? v.toString() : v)

const extractMinorVersion = (v) =>
    v.indexOf('2.') === 0 ? parseInt(v.slice(2, 4)) : parseInt(v.slice(0, 2))

const MIN_DHIS2_VERSION = extractMinorVersion(
    getString(d2config.minDHIS2Version)
)

const getInstanceMinorVersion = (dhis2InstanceVersion) => {
    if (dhis2InstanceVersion.toLowerCase() === 'dev') {
        return MIN_DHIS2_VERSION + 3
    }

    return extractMinorVersion(dhis2InstanceVersion)
}

const getExcludedTags = (v) => {
    const currentInstanceVersion = getInstanceMinorVersion(getString(v))

    if (currentInstanceVersion < MIN_DHIS2_VERSION) {
        throw new Error(
            'Instance version is lower than the minimum supported version'
        )
    }

    let excludeTags = []
    if (currentInstanceVersion === MIN_DHIS2_VERSION) {
        // For example instance = 2.38, MIN = 2.38
        excludeTags = [
            `<${currentInstanceVersion}`,
            `>${currentInstanceVersion}`,
            `>=${currentInstanceVersion + 1}`,
            `>${currentInstanceVersion + 1}`,
            `>=${currentInstanceVersion + 2}`,
            `>${currentInstanceVersion + 2}`,
            `>=${currentInstanceVersion + 3}`,
        ]
    } else if (currentInstanceVersion === MIN_DHIS2_VERSION + 1) {
        // For example instance = 2.39, MIN = 2.38
        excludeTags = [
            `<=${currentInstanceVersion - 1}`,
            `<${currentInstanceVersion - 1}`,
            `<${currentInstanceVersion}`,
            `>${currentInstanceVersion}`,
            `>=${currentInstanceVersion + 1}`,
            `>${currentInstanceVersion + 1}`,
            `>=${currentInstanceVersion + 2}`,
        ]
    } else if (currentInstanceVersion === MIN_DHIS2_VERSION + 2) {
        // For example instance = 2.40, MIN = 2.38
        excludeTags = [
            `<=${currentInstanceVersion - 2}`,
            `<${currentInstanceVersion - 2}`,
            `<=${currentInstanceVersion - 1}`,
            `<${currentInstanceVersion - 1}`,
            `<${currentInstanceVersion}`,
            `>${currentInstanceVersion}`,
            `>=${currentInstanceVersion + 1}`,
        ]
    } else {
        // For example instance = 2.41, MIN = 2.38
        excludeTags = [
            `<=${currentInstanceVersion - 3}`,
            `<${currentInstanceVersion - 3}`,
            `<=${currentInstanceVersion - 2}`,
            `<${currentInstanceVersion - 2}`,
            `<${currentInstanceVersion - 1}`,
            `<=${currentInstanceVersion - 1}`,
            `<${currentInstanceVersion}`,
        ]
    }

    return excludeTags
}

const excludeByVersionTags = (on, config) => {
    const excludedTags = getExcludedTags(config.env.dhis2InstanceVersion)

    console.log('instanceVersion', config.env.dhis2InstanceVersion)
    console.log('tags to exclude from testing', excludedTags)

    config.env.CYPRESS_EXCLUDE_TAGS = excludedTags.join(',')

    on('file:preprocessor', tagify(config))
}

module.exports = { excludeByVersionTags, getExcludedTags }
