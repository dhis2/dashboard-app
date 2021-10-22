import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { CssVariables } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { tSetControlBarRows } from '../actions/controlBar'
import { tFetchDashboards } from '../actions/dashboards'
import { tSetShowDescription } from '../actions/showDescription'
import { NewDashboard, EditDashboard } from '../pages/edit'
import { PrintDashboard, PrintLayoutDashboard } from '../pages/print'
import { ViewDashboard } from '../pages/view'

import './styles/App.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './styles/ItemGrid.css'

const App = props => {
    const { d2 } = useD2()

    useEffect(() => {
        props.fetchDashboards()
        props.setControlBarRows()
        props.setShowDescription()

        // store the headerbar height for controlbar height calculations
        const headerbarHeight = document
            .querySelector('header')
            .getBoundingClientRect().height

        document.documentElement.style.setProperty(
            '--headerbar-height',
            `${headerbarHeight}px`
        )
    }, [])

    return (
        <>
            <CssVariables colors spacers />
            <Router>
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={props => (
                            <ViewDashboard
                                {...props}
                                username={d2.currentUser.username}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/new"
                        render={props => <NewDashboard {...props} />}
                    />
                    <Route
                        exact
                        path="/:dashboardId"
                        render={props => (
                            <ViewDashboard
                                {...props}
                                username={d2.currentUser.username}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/:dashboardId/edit"
                        render={props => <EditDashboard {...props} />}
                    />
                    <Route
                        exact
                        path="/:dashboardId/printoipp"
                        render={props => <PrintDashboard {...props} />}
                    />
                    <Route
                        exact
                        path="/:dashboardId/printlayout"
                        render={props => <PrintLayoutDashboard {...props} />}
                    />
                </Switch>
            </Router>
        </>
    )
}

App.propTypes = {
    fetchDashboards: PropTypes.func,
    setControlBarRows: PropTypes.func,
    setShowDescription: PropTypes.func,
}

const mapDispatchToProps = {
    fetchDashboards: tFetchDashboards,
    setControlBarRows: tSetControlBarRows,
    setShowDescription: tSetShowDescription,
}

export default connect(null, mapDispatchToProps)(App)
