import {
    APP,
    CHART,
    EVENT_CHART,
    EVENT_REPORT,
    EVENT_VISUALIZATION,
    MAP,
    REPORT_TABLE,
    VISUALIZATION,
} from '../../../../../modules/itemTypes.js'
import { hasPluginAccess } from '../plugin.js'

describe('hasPluginAccess', () => {
    test.each([CHART, REPORT_TABLE, VISUALIZATION])(
        'denies access to %s without the Data Visualizer authority',
        (type) => {
            expect(hasPluginAccess(type, ['M_dhis-web-maps'])).toBe(false)
        }
    )

    test.each([CHART, REPORT_TABLE, VISUALIZATION])(
        'grants access to %s with the Data Visualizer authority',
        (type) => {
            expect(hasPluginAccess(type, ['M_dhis-web-data-visualizer'])).toBe(
                true
            )
        }
    )

    test('denies access to MAP without the Maps authority', () => {
        expect(hasPluginAccess(MAP, ['M_dhis-web-data-visualizer'])).toBe(false)
    })

    test('grants access to MAP with the Maps authority', () => {
        expect(hasPluginAccess(MAP, ['M_dhis-web-maps'])).toBe(true)
    })

    test.each([
        [EVENT_REPORT, 'M_dhis-web-event-reports'],
        [EVENT_CHART, 'M_dhis-web-event-visualizer'],
    ])('checks the app authority for %s', (type, authority) => {
        expect(hasPluginAccess(type, [authority])).toBe(true)
        expect(hasPluginAccess(type, ['M_dhis-web-data-visualizer'])).toBe(
            false
        )
    })

    test.each([VISUALIZATION, MAP, EVENT_REPORT])(
        'grants access to %s with the ALL authority',
        (type) => {
            expect(hasPluginAccess(type, ['ALL'])).toBe(true)
        }
    )

    test.each([VISUALIZATION, MAP])(
        'grants access to %s with the app management authority',
        (type) => {
            expect(hasPluginAccess(type, ['M_dhis-web-app-management'])).toBe(
                true
            )
        }
    )

    test('denies access when authorities are missing', () => {
        expect(hasPluginAccess(VISUALIZATION)).toBe(false)
    })

    test.each([
        [EVENT_VISUALIZATION, 'M_linelisting'],
        [EVENT_VISUALIZATION, 'M_dhis-web-line-listing'],
    ])('grants access to %s with the %s authority', (type, authority) => {
        expect(hasPluginAccess(type, [authority])).toBe(true)
        expect(hasPluginAccess(type, ['M_dhis-web-data-visualizer'])).toBe(
            false
        )
    })

    test('does not check authorities for APP', () => {
        expect(hasPluginAccess(APP, [])).toBe(true)
    })
})
