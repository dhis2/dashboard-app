import { getIframeSrc } from '../getIframeSrc.js'

const appDetails = { launchUrl: 'debug/dev' }
const dashboardItem = { id: 'rainbowdashitem' }

describe('getIframeSrc', () => {
    it('no ou filter', () => {
        const ouFilter = []

        const src = getIframeSrc(appDetails, dashboardItem, { ou: ouFilter })
        expect(src).toEqual(
            `${appDetails.launchUrl}?dashboardItemId=${dashboardItem.id}`
        )
    })

    it('should return the correct iframe src', () => {
        const ouFilter = [
            {
                id: 'fdc6uOvgoji',
                path: '/ImspTQPwCqd/fdc6uOvgoji',
                name: 'Bombali',
            },
            {
                id: 'lc3eMKXaEfw',
                path: '/ImspTQPwCqd/lc3eMKXaEfw',
                name: 'Bonthe',
            },
        ]

        const appDetails = { launchUrl: 'debug/dev' }
        const dashboardItem = { id: 'rainbowdashitem' }

        const src = getIframeSrc(appDetails, dashboardItem, { ou: ouFilter })
        expect(src).toEqual(
            `${appDetails.launchUrl}?dashboardItemId=${dashboardItem.id}&userOrgUnit=fdc6uOvgoji,lc3eMKXaEfw`
        )
    })

    it('org unit group in filter', () => {
        const ouFilter = [
            {
                id: 'OU_GROUP-b0EsAxm8Nge',
                name: 'Western Area',
            },
            {
                id: 'lc3eMKXaEfw',
                path: '/ImspTQPwCqd/lc3eMKXaEfw',
                name: 'Bonthe',
            },
        ]

        const appDetails = { launchUrl: 'debug/dev' }
        const dashboardItem = { id: 'rainbowdashitem' }

        const src = getIframeSrc(appDetails, dashboardItem, { ou: ouFilter })
        expect(src).toEqual(
            `${appDetails.launchUrl}?dashboardItemId=${dashboardItem.id}&userOrgUnit=OU_GROUP-b0EsAxm8Nge,lc3eMKXaEfw`
        )
    })

    it('org unit level in filter', () => {
        const ouFilter = [
            {
                id: 'LEVEL-m9lBJogzE95',
                name: 'Facility',
            },
            {
                id: 'fdc6uOvgoji',
                path: '/ImspTQPwCqd/fdc6uOvgoji',
                name: 'Bombali',
            },
        ]

        const appDetails = { launchUrl: 'debug/dev' }
        const dashboardItem = { id: 'rainbowdashitem' }

        const src = getIframeSrc(appDetails, dashboardItem, { ou: ouFilter })
        expect(src).toEqual(
            `${appDetails.launchUrl}?dashboardItemId=${dashboardItem.id}&userOrgUnit=LEVEL-m9lBJogzE95,fdc6uOvgoji`
        )
    })

    it('user org unit in filter', () => {
        const ouFilter = [
            {
                id: 'USER_ORGUNIT',
                displayName: 'User organisation unit',
            },
        ]

        const appDetails = { launchUrl: 'debug/dev' }
        const dashboardItem = { id: 'rainbowdashitem' }

        const src = getIframeSrc(appDetails, dashboardItem, { ou: ouFilter })
        expect(src).toEqual(
            `${appDetails.launchUrl}?dashboardItemId=${dashboardItem.id}&userOrgUnit=USER_ORGUNIT`
        )
    })

    it('all user org units in filter', () => {
        const ouFilter = [
            {
                id: 'USER_ORGUNIT_CHILDREN',
                displayName: 'User sub-units',
            },
            {
                id: 'USER_ORGUNIT_GRANDCHILDREN',
                displayName: 'User sub-x2-units',
            },
            {
                id: 'USER_ORGUNIT',
                displayName: 'User organisation unit',
            },
        ]

        const appDetails = { launchUrl: 'debug/dev' }
        const dashboardItem = { id: 'rainbowdashitem' }

        const src = getIframeSrc(appDetails, dashboardItem, { ou: ouFilter })
        expect(src).toEqual(
            `${appDetails.launchUrl}?dashboardItemId=${dashboardItem.id}&userOrgUnit=USER_ORGUNIT_CHILDREN,USER_ORGUNIT_GRANDCHILDREN,USER_ORGUNIT`
        )
    })
})
