import { getIframeSrc } from '../getIframeSrc.js'

const appDetails = { launchUrl: 'debug/dev' }
const dashboardItem = { id: 'rainbowdashitem' }
const expectedSrc = `${appDetails.launchUrl}?dashboardItemId=${dashboardItem.id}`

describe('getIframeSrc', () => {
    it('no ou filter', () => {
        const ouFilter = []

        const src = getIframeSrc(appDetails, dashboardItem, { ou: ouFilter })
        expect(src).toEqual(expectedSrc)
    })

    it('org units chosen from the tree', () => {
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

        const src = getIframeSrc(appDetails, dashboardItem, { ou: ouFilter })
        expect(src).toEqual(
            `${expectedSrc}&userOrgUnit=fdc6uOvgoji,lc3eMKXaEfw`
        )
    })

    it('org unit group and org unit from tree', () => {
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

        const src = getIframeSrc(appDetails, dashboardItem, { ou: ouFilter })
        expect(src).toEqual(
            `${expectedSrc}&userOrgUnit=OU_GROUP-b0EsAxm8Nge,lc3eMKXaEfw`
        )
    })

    it('org unit level and org unit from tree', () => {
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

        const src = getIframeSrc(appDetails, dashboardItem, { ou: ouFilter })
        expect(src).toEqual(
            `${expectedSrc}&userOrgUnit=LEVEL-m9lBJogzE95,fdc6uOvgoji`
        )
    })

    it('user org unit', () => {
        const ouFilter = [
            {
                id: 'USER_ORGUNIT',
                displayName: 'User organisation unit',
            },
        ]

        const src = getIframeSrc(appDetails, dashboardItem, { ou: ouFilter })
        expect(src).toEqual(`${expectedSrc}&userOrgUnit=USER_ORGUNIT`)
    })

    it('all user org units', () => {
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

        const src = getIframeSrc(appDetails, dashboardItem, { ou: ouFilter })
        expect(src).toEqual(
            `${expectedSrc}&userOrgUnit=USER_ORGUNIT_CHILDREN,USER_ORGUNIT_GRANDCHILDREN,USER_ORGUNIT`
        )
    })

    it('only period filter with a single value', () => {
        const peFilter = [{ id: 'LAST_MONTH' }];

        const src = getIframeSrc(appDetails, dashboardItem, { pe: peFilter });
        expect(src).toEqual(`${expectedSrc}&period=LAST_MONTH`);
    });

    it('only period filter with multiple values', () => {
        const peFilter = [
            { id: 'LAST_MONTH' },
            { id: 'LAST_3_MONTHS' },
        ];

        const src = getIframeSrc(appDetails, dashboardItem, { pe: peFilter });
        expect(src).toEqual(`${expectedSrc}&period=LAST_MONTH,LAST_3_MONTHS`);
    });

    it('period filter and org unit filter', () => {
        const peFilter = [{ id: 'LAST_MONTH' }];
        const ouFilter = [
            {
                id: 'fdc6uOvgoji',
                path: '/ImspTQPwCqd/fdc6uOvgoji',
                name: 'Bombali',
            },
        ];

        const src = getIframeSrc(appDetails, dashboardItem, { pe: peFilter, ou: ouFilter });
        expect(src).toEqual(`${expectedSrc}&userOrgUnit=fdc6uOvgoji&period=LAST_MONTH`);
    });

    it('period filter with multiple values and org unit filter', () => {
        const peFilter = [
            { id: 'LAST_MONTH' },
            { id: 'LAST_3_MONTHS' },
        ];
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
        ];

        const src = getIframeSrc(appDetails, dashboardItem, { pe: peFilter, ou: ouFilter });
        expect(src).toEqual(`${expectedSrc}&userOrgUnit=fdc6uOvgoji,lc3eMKXaEfw&period=LAST_MONTH,LAST_3_MONTHS`);
    });

    it('empty pe filter', () => {
        const peFilter = [];

        const src = getIframeSrc(appDetails, dashboardItem, { pe: peFilter });
        expect(src).toEqual(expectedSrc);
    });
})
