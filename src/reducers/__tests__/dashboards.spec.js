import reducer, { actionTypes, DEFAULT_DASHBOARDS } from '../dashboards'

describe('dashboards reducer', () => {
    const boards = {
        dash1: {
            id: 'dash1',
            name: 'good stuff',
            displayName: 'untranslated',
            dashboardItems: []
        },
        dash2: {
            id: 'dash2',
            name: 'ok stuff',
            dashboardItems: [{ id: '234' }]
        }
    }

    it('should return the default state', () => {
        const actualState = reducer(undefined, { type: 'NO_MATCH' })

        expect(actualState).toEqual(DEFAULT_DASHBOARDS)
    })

    it('should set the list of dashboards by replacing the existing list', () => {
        const currentState = { dash0: { id: 'dash0' } }
        const actualState = reducer(currentState, {
            type: actionTypes.SET_DASHBOARDS,
            append: false,
            value: boards
        })

        expect(actualState).toEqual(boards)
    })

    it('should append to the list of dashboards', () => {
        const currentState = { dash0: { id: 'dash0' } }
        const actualState = reducer(currentState, {
            type: actionTypes.SET_DASHBOARDS,
            append: true,
            value: boards
        })

        const expected = Object.assign({}, boards, currentState)

        expect(actualState).toEqual(expected)
    })

    it('should set the displayName on a dashboard', () => {
        const currentState = boards
        const actualState = reducer(currentState, {
            type: actionTypes.SET_DASHBOARD_DISPLAY_NAME,
            dashboardId: 'dash1',
            value: 'bella roba'
        })

        const expected = Object.assign({}, currentState, {
            dash1: {
                id: 'dash1',
                name: 'good stuff',
                displayName: 'bella roba',
                dashboardItems: []
            }
        })

        expect(actualState).toEqual(expected)
    })
})
