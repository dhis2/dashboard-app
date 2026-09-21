import {
    apiGetRecentDashboards,
    apiPostRecentDashboards,
} from '../recentDashboards.js'

describe('apiGetRecentDashboards', () => {
    it('returns the stored entries', async () => {
        const engine = {
            query: jest.fn().mockResolvedValue({
                recentDashboards: { entries: [{ id: 'a', lastOpened: 1 }] },
            }),
        }

        await expect(apiGetRecentDashboards(engine)).resolves.toEqual([
            { id: 'a', lastOpened: 1 },
        ])
    })

    it('returns an empty list when the key does not exist yet', async () => {
        const engine = {
            query: jest
                .fn()
                .mockRejectedValue({ details: { httpStatusCode: 404 } }),
        }

        await expect(apiGetRecentDashboards(engine)).resolves.toEqual([])
    })

    it('returns null when the request fails for any other reason', async () => {
        const engine = {
            query: jest.fn().mockRejectedValue(new Error('offline')),
        }

        await expect(apiGetRecentDashboards(engine)).resolves.toBeNull()
    })
})

describe('apiPostRecentDashboards', () => {
    it('updates the key and resolves true on success', async () => {
        const engine = { mutate: jest.fn().mockResolvedValue({}) }

        await expect(
            apiPostRecentDashboards(engine, [{ id: 'a', lastOpened: 1 }])
        ).resolves.toBe(true)

        expect(engine.mutate).toHaveBeenCalledWith(
            expect.objectContaining({
                resource: 'userDataStore/dashboard/recentDashboards',
                type: 'update',
                data: { entries: [{ id: 'a', lastOpened: 1 }] },
            })
        )
    })

    it('creates the key when update fails with a 404, and resolves true', async () => {
        const engine = {
            mutate: jest
                .fn()
                .mockRejectedValueOnce({ details: { httpStatusCode: 404 } })
                .mockResolvedValueOnce({}),
        }

        await expect(apiPostRecentDashboards(engine, [])).resolves.toBe(true)

        expect(engine.mutate).toHaveBeenCalledTimes(2)
        expect(engine.mutate).toHaveBeenLastCalledWith(
            expect.objectContaining({ type: 'create' })
        )
    })

    it('resolves false and does not attempt to create when update fails for a non-404 reason', async () => {
        const engine = {
            mutate: jest.fn().mockRejectedValue(new Error('offline')),
        }

        await expect(apiPostRecentDashboards(engine, [])).resolves.toBe(false)

        expect(engine.mutate).toHaveBeenCalledTimes(1)
    })

    it('resolves false when update 404s and the fallback create also fails', async () => {
        const engine = {
            mutate: jest
                .fn()
                .mockRejectedValueOnce({ details: { httpStatusCode: 404 } })
                .mockRejectedValueOnce(new Error('offline')),
        }

        await expect(apiPostRecentDashboards(engine, [])).resolves.toBe(false)

        expect(engine.mutate).toHaveBeenCalledTimes(2)
    })

    it('does not attempt to create when update fails for a non-404 reason', async () => {
        const engine = {
            mutate: jest.fn().mockRejectedValue(new Error('offline')),
        }

        await apiPostRecentDashboards(engine, [])

        expect(engine.mutate).toHaveBeenCalledTimes(1)
    })
})
