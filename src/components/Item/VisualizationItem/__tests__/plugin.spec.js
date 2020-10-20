import * as d2lib from 'd2'

import { fetch } from '../plugin'
import { CHART } from '../../../../modules/itemTypes'
import * as apiMetadata from '../../../../api/metadata'

describe('plugin', () => {
    describe('fetch', () => {
        let mockD2
        let mockGetFn

        beforeEach(() => {
            mockGetFn = jest.fn().mockResolvedValue({ pager: {} })
            mockD2 = { Api: { getApi: () => ({ get: mockGetFn }) } }
            d2lib.getInstance = () => Promise.resolve(mockD2)
            apiMetadata.apiFetchFavorite = jest.fn()
        })

        it('fires apiFetchFavorite request', async done => {
            const item = { type: CHART, chart: { id: 'SOME_ID' } }

            await fetch(item)

            expect(apiMetadata.apiFetchFavorite).toHaveBeenCalledTimes(1)

            done()
        })
    })
})
