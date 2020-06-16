import React from 'react'
import { shallow } from 'enzyme'
import { App } from '../App'

/* eslint-disable react/display-name */
jest.mock('../Dashboard/Dashboard', () => () => (
    <div id="mockDashboard">mockDashboard</div>
))
/* eslint-enable react/display-name */

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
            d2: {},
            setCurrentUser: jest.fn(),
            fetchDashboards: jest.fn(),
            setControlBarRows: jest.fn(),
            setDimensions: jest.fn(),
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
