import { getDomGridItemsSortedByYPos, getTransformYPx } from '../printUtils'

describe('printUtils', () => {
    describe('getDomGridItemsSortedByYPos', () => {
        it('handles empty array', () => {
            expect(getDomGridItemsSortedByYPos([])).toEqual([])
        })

        it('handles grid items with page breaks - transform', () => {
            const bottomItemH = 370
            const bottomItemTy = '2390'
            const elements = [
                {
                    classList: ['react-grid-item', 'PAGEBREAK'],
                    getBoundingClientRect: () => ({
                        y: 158,
                        height: 50,
                    }),
                    style: {
                        transform: 'translate(10px, 4690px)',
                    },
                },
                {
                    classList: ['react-grid-item', 'PAGEBREAK'],
                    getBoundingClientRect: () => ({
                        y: 158,
                        height: 50,
                    }),
                    style: {
                        transform: 'translate(10px, 3890px)',
                    },
                },
                {
                    classList: ['react-grid-item', 'PAGEBREAK'],
                    getBoundingClientRect: () => ({
                        y: 158,
                        height: 50,
                    }),
                    style: {
                        transform: 'translate(10px, 3090px)',
                    },
                },
                {
                    classList: ['react-grid-item', 'PAGEBREAK'],
                    getBoundingClientRect: () => ({
                        y: 158,
                        height: 50,
                    }),
                    style: {
                        transform: 'translate(10px, 2290px)',
                    },
                },
                {
                    classList: ['react-grid-item', 'PAGEBREAK'],
                    getBoundingClientRect: () => ({
                        y: 158,
                        height: 50,
                    }),
                    style: {
                        transform: 'translate(10px, 1510px)',
                    },
                },
                {
                    classList: ['react-grid-item', 'PAGEBREAK'],
                    getBoundingClientRect: () => ({
                        y: 158,
                        height: 50,
                    }),
                    style: {
                        transform: 'translate(10px, 710px)',
                    },
                },
                {
                    classList: ['react-grid-item', 'EVENT_CHART'],
                    getBoundingClientRect: () => ({
                        y: 158,
                        height: 530,
                    }),
                    style: {
                        transform: 'translate(738px, 10px)',
                    },
                },
                {
                    classList: ['react-grid-item', 'MESSAGES'],
                    getBoundingClientRect: () => ({
                        y: 158,
                        height: 330,
                    }),
                    style: {
                        transform: 'translate(738px, 2390px)',
                    },
                },
                {
                    classList: ['react-grid-item', 'REPORT_TABLE'],
                    getBoundingClientRect: () => ({
                        y: 158,
                        height: bottomItemH,
                    }),
                    style: {
                        transform: 'translate(738px, 2390px)',
                    },
                },
                {
                    classList: ['react-grid-item', 'EVENT_REPORT'],
                    getBoundingClientRect: () => ({
                        y: 158,
                        height: 530,
                    }),
                    style: {
                        transform: 'translate(10px, 10px)',
                    },
                },
                {
                    classList: ['react-grid-item', 'SPACER'],
                    getBoundingClientRect: () => ({
                        y: 158,
                        height: 430,
                    }),
                    style: {
                        transform: 'translate(720px, 810px)',
                    },
                },
                {
                    classList: ['react-grid-item', 'TEXT'],
                    getBoundingClientRect: () => ({
                        y: 158,
                        height: 430,
                    }),
                    style: {
                        transform: 'translate(10px, 810px)',
                    },
                },
                {
                    classList: ['react-grid-item', 'MAP'],
                    getBoundingClientRect: () => ({
                        y: 158,
                        height: 430,
                    }),
                    style: {
                        transform: 'translate(738px, 1610px)',
                    },
                },
                {
                    classList: ['react-grid-item', 'CHART'],
                    getBoundingClientRect: () => ({
                        y: 158,
                        height: 430,
                    }),
                    style: {
                        transform: 'translate(10px, 1610px)',
                    },
                },
            ]

            const result = getDomGridItemsSortedByYPos(elements)

            expect(result.length).toEqual(elements.length)
            const expectedPageBreakIndexes = [2, 5, 8, 11, 12, 13]

            expectedPageBreakIndexes.forEach(i => {
                expect(result[i].type).toEqual('PAGEBREAK')
            })

            const expectedBottomItem = result[10]
            expect(expectedBottomItem.type).toEqual('REPORT_TABLE')
            expect(expectedBottomItem.bottomY).toEqual(
                bottomItemH + parseInt(bottomItemTy)
            )
        })

        it('handles grid items with page breaks - no transform', () => {
            const bottomItemH = 370
            const bottomItemY = 2548
            const elements = [
                {
                    classList: ['react-grid-item', 'PAGEBREAK'],
                    getBoundingClientRect: () => ({
                        y: 4848,
                        height: 50,
                    }),
                    style: {},
                },
                {
                    classList: ['react-grid-item', 'PAGEBREAK'],
                    getBoundingClientRect: () => ({
                        y: 4048,
                        height: 50,
                    }),
                    style: {},
                },
                {
                    classList: ['react-grid-item', 'PAGEBREAK'],
                    getBoundingClientRect: () => ({
                        y: 3248,
                        height: 50,
                    }),
                    style: {},
                },
                {
                    classList: ['react-grid-item', 'PAGEBREAK'],
                    getBoundingClientRect: () => ({
                        y: 2448,
                        height: 50,
                    }),
                    style: {},
                },
                {
                    classList: ['react-grid-item', 'PAGEBREAK'],
                    getBoundingClientRect: () => ({
                        y: 1668,
                        height: 50,
                    }),
                    style: {},
                },
                {
                    classList: ['react-grid-item', 'PAGEBREAK'],
                    getBoundingClientRect: () => ({
                        y: 868,
                        height: 50,
                    }),
                    style: {},
                },
                {
                    classList: ['react-grid-item', 'EVENT_CHART'],
                    getBoundingClientRect: () => ({
                        y: 168,
                        height: 530,
                    }),
                    style: {},
                },

                {
                    classList: ['react-grid-item', 'REPORT_TABLE'],
                    getBoundingClientRect: () => ({
                        y: bottomItemY,
                        height: bottomItemH,
                    }),
                    style: {},
                },
                {
                    classList: ['react-grid-item', 'EVENT_REPORT'],
                    getBoundingClientRect: () => ({
                        y: 168,
                        height: 530,
                    }),
                    style: {},
                },
                {
                    classList: ['react-grid-item', 'SPACER'],
                    getBoundingClientRect: () => ({
                        y: 968,
                        height: 430,
                    }),
                    style: {},
                },
                {
                    classList: ['react-grid-item', 'TEXT'],
                    getBoundingClientRect: () => ({
                        y: 968,
                        height: 430,
                    }),
                    style: {},
                },
                {
                    classList: ['react-grid-item', 'MAP'],
                    getBoundingClientRect: () => ({
                        y: 1768,
                        height: 430,
                    }),
                    style: {},
                },
                {
                    classList: ['react-grid-item', 'CHART'],
                    getBoundingClientRect: () => ({
                        y: 1768,
                        height: 430,
                    }),
                    style: {},
                },
                {
                    classList: ['react-grid-item', 'MESSAGES'],
                    getBoundingClientRect: () => ({
                        y: 2548,
                        height: 330,
                    }),
                    style: {},
                },
            ]

            const result = getDomGridItemsSortedByYPos(elements)

            expect(result.length).toEqual(elements.length)
            const expectedPageBreakIndexes = [2, 5, 8, 11, 12, 13]

            expectedPageBreakIndexes.forEach(i => {
                expect(result[i].type).toEqual('PAGEBREAK')
            })

            const expectedBottomItem = result[10]
            expect(expectedBottomItem.type).toEqual('REPORT_TABLE')
            expect(expectedBottomItem.bottomY).toEqual(
                bottomItemH + parseInt(bottomItemY)
            )
        })
    })

    describe('getTransformYPx', () => {
        it('returns null if style is not defined', () => {
            const style = undefined
            expect(getTransformYPx(style)).toEqual(null)
        })

        it('returns null if no transform property', () => {
            const style = {}
            expect(getTransformYPx(style)).toEqual(null)
        })

        it('returns null if transform is malformed', () => {
            const style = {
                transform: 'ab',
            }
            expect(getTransformYPx(style)).toEqual(null)
        })

        it('returns y position if px', () => {
            const style = {
                transform: 'translate(10px, 300px)',
            }

            expect(getTransformYPx(style)).toEqual(300)
        })

        it('returns null if not px units', () => {
            const style = {
                transform: 'translate(10%, 50%)',
            }

            expect(getTransformYPx(style)).toEqual(null)
        })
    })
})
