import { parseSupersetDashboardFieldValues } from '../parseSupersetDashboardFieldValues.js'

const embedId = '0394041b-8367-4fe2-9777-fe54b6d2da2f'
const fieldValues = {
    title: 'Malaria overview',
    description: 'A description',
    code: 'MAL_1',
    supersetEmbedId: embedId,
    showChartControls: true,
    expandFilters: false,
    restrictOrgUnitHierarchy: false,
}

describe('parseSupersetDashboardFieldValues', () => {
    it('parses the field values into a dashboard payload', () => {
        expect(parseSupersetDashboardFieldValues(fieldValues)).toEqual({
            name: 'Malaria overview',
            description: 'A description',
            code: 'MAL_1',
            embedded: {
                provider: 'SUPERSET',
                id: embedId,
                options: {
                    hideTab: false,
                    hideChartControls: false,
                    filters: {
                        visible: true,
                        expanded: false,
                    },
                },
                security: {
                    restrictOrgUnitHierarchy: false,
                },
            },
        })
    })

    it('falls back to a default name when the title is empty', () => {
        expect(
            parseSupersetDashboardFieldValues({ ...fieldValues, title: '' })
                .name
        ).toBe('Untitled dashboard')
    })

    it('inverts showChartControls into hideChartControls', () => {
        expect(
            parseSupersetDashboardFieldValues({
                ...fieldValues,
                showChartControls: false,
            }).embedded.options.hideChartControls
        ).toBe(true)
    })

    describe('security.restrictOrgUnitHierarchy', () => {
        it('is included when enabled', () => {
            expect(
                parseSupersetDashboardFieldValues({
                    ...fieldValues,
                    restrictOrgUnitHierarchy: true,
                }).embedded.security
            ).toEqual({ restrictOrgUnitHierarchy: true })
        })

        it('is included when disabled', () => {
            expect(
                parseSupersetDashboardFieldValues({
                    ...fieldValues,
                    restrictOrgUnitHierarchy: false,
                }).embedded.security
            ).toEqual({ restrictOrgUnitHierarchy: false })
        })

        it('forces a missing value to false', () => {
            const withoutFlag = { ...fieldValues }
            delete withoutFlag.restrictOrgUnitHierarchy
            expect(
                parseSupersetDashboardFieldValues(withoutFlag).embedded.security
            ).toEqual({ restrictOrgUnitHierarchy: false })
        })
    })
})
