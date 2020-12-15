import React from 'react'
import { shallow } from 'enzyme'
import { App } from '../App'

jest.mock('../Dashboard/Dashboard', () => 'Dashboard')
jest.mock('../../actions/dimensions', () => ({ tSetDimensions: () => null }))
jest.mock('../../actions/dashboards', () => ({ tFetchDashboards: () => null }))

describe('App', () => {
    let props
    let shallowApp
    let context
    const app = context => {
        if (!shallowApp) {
            shallowApp = shallow(<App {...props} />, {
                context,
            })
        }
        return shallowApp
    }

    beforeEach(() => {
        props = {
            fetchDashboards: jest.fn(),
            setCurrentUser: jest.fn(),
            setControlBarRows: jest.fn(),
            setDimensions: jest.fn(),
            addSettings: jest.fn(),
            setShowDescription: jest.fn(),
            d2: {},
        }
        shallowApp = undefined
        context = {
            store: {
                dispatch: jest.fn(),
            },
        }
    })

    it('renders the App', () => {
        expect(app(context)).toMatchSnapshot()
    })

    it('fetches the dashboards', () => {
        app(context)

        expect(props.fetchDashboards).toHaveBeenCalledTimes(1)
    })
})
