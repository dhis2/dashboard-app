import getFilteredVisualization from '../getFilteredVisualization.js'

describe('getFilteredVisualization', () => {
    test('modifies existing visualization filter', () => {
        const filters = {
            pe: [{ id: 'FILTER_PE' }],
        }

        const vis = {
            id: 'myvisualization',
            rows: [{ dimension: 'ou', items: [{ id: 'SIERRA_LEONE' }] }],
            filters: [{ dimension: 'pe', items: [{ id: 'THIS_YEAR' }] }],
            columns: [
                {
                    dimension: 'dx',
                    items: [{ id: 'anc1' }, { id: 'anc2' }],
                },
            ],
        }

        expect(getFilteredVisualization(vis, filters)).toEqual(
            expect.objectContaining({
                id: 'myvisualization',
                rows: [{ dimension: 'ou', items: [{ id: 'SIERRA_LEONE' }] }],
                filters: [{ dimension: 'pe', items: [{ id: 'FILTER_PE' }] }],
                columns: [
                    {
                        dimension: 'dx',
                        items: [{ id: 'anc1' }, { id: 'anc2' }],
                    },
                ],
            })
        )
    })

    test('modifies existing visualization rows', () => {
        const filters = {
            ou: [{ id: 'BO' }],
        }

        const vis = {
            rows: [{ dimension: 'ou', items: [{ id: 'SIERRA_LEONE' }] }],
            filters: [{ dimension: 'pe', items: [{ id: 'THIS_YEAR' }] }],
            columns: [
                {
                    dimension: 'dx',
                    items: [{ id: 'anc1' }, { id: 'anc2' }],
                },
            ],
        }

        expect(getFilteredVisualization(vis, filters)).toEqual(
            expect.objectContaining({
                rows: [{ dimension: 'ou', items: [{ id: 'BO' }] }],
                filters: [{ dimension: 'pe', items: [{ id: 'THIS_YEAR' }] }],
                columns: [
                    {
                        dimension: 'dx',
                        items: [{ id: 'anc1' }, { id: 'anc2' }],
                    },
                ],
            })
        )
    })

    test('modifies existing visualization columns', () => {
        const filters = {
            facility: [{ id: 'CLINIC' }, { id: 'HOSPITAL' }],
        }

        const vis = {
            rows: [{ dimension: 'ou', items: [{ id: 'SIERRA_LEONE' }] }],
            filters: [{ dimension: 'pe', items: [{ id: 'THIS_YEAR' }] }],
            columns: [
                {
                    dimension: 'facility',
                    items: [
                        { id: 'CLINIC' },
                        { id: 'HOSPITAL' },
                        { id: 'CHC' },
                        { id: 'CHP' },
                        { id: 'MCHP' },
                    ],
                },
            ],
        }

        expect(getFilteredVisualization(vis, filters)).toEqual(
            expect.objectContaining({
                filters: [{ dimension: 'pe', items: [{ id: 'THIS_YEAR' }] }],
                rows: [{ dimension: 'ou', items: [{ id: 'SIERRA_LEONE' }] }],
                columns: [
                    {
                        dimension: 'facility',
                        items: [{ id: 'CLINIC' }, { id: 'HOSPITAL' }],
                    },
                ],
            })
        )
    })

    test('adds new filter to visualization filters', () => {
        const filters = {
            pe: [{ id: 'FILTER_PE' }],
            facility: [{ id: 'CLINIC' }, { id: 'HOSPITAL' }],
        }

        const vis = {
            rows: [{ dimension: 'ou', items: [{ id: 'SIERRA_LEONE' }] }],
            filters: [{ dimension: 'pe', items: [{ id: 'THIS_YEAR' }] }],
            columns: [
                {
                    dimension: 'dx',
                    items: [{ id: 'anc1' }, { id: 'anc2' }],
                },
            ],
        }

        expect(getFilteredVisualization(vis, filters)).toEqual(
            expect.objectContaining({
                rows: [{ dimension: 'ou', items: [{ id: 'SIERRA_LEONE' }] }],
                filters: [
                    { dimension: 'pe', items: [{ id: 'FILTER_PE' }] },
                    {
                        dimension: 'facility',
                        items: [{ id: 'CLINIC' }, { id: 'HOSPITAL' }],
                    },
                ],
                columns: [
                    {
                        dimension: 'dx',
                        items: [{ id: 'anc1' }, { id: 'anc2' }],
                    },
                ],
            })
        )
    })
})
