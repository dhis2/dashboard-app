import React, { useEffect } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { CssVariables } from '@dhis2/ui'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { apiFetchDimensions } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'

import Dashboard from './Dashboard/Dashboard'
import AlertBar from './AlertBar/AlertBar'
import { useUserSettings } from './UserSettingsProvider'

import { acReceivedUser } from '../actions/user'
import { tFetchDashboards } from '../actions/dashboards'
import { tSetControlBarRows } from '../actions/controlBar'
import { tSetShowDescription } from '../actions/selected'
import { acSetDimensions } from '../actions/dimensions'
import getFilteredDimensions from '../modules/getFilteredDimensions'

import {
    EDIT,
    VIEW,
    NEW,
    PRINT,
    PRINT_LAYOUT,
} from './Dashboard/dashboardModes'

import './App.css'

const App = props => {
    const { d2 } = useD2()
    const dataEngine = useDataEngine()
    const { userSettings } = useUserSettings()

    useEffect(() => {
        props.setCurrentUser(d2.currentUser)
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

    useEffect(() => {
        const fetchDimensions = async () => {
            try {
                const dimensions = await apiFetchDimensions(
                    dataEngine,
                    userSettings.keyAnalysisDisplayProperty
                )

                props.setDimensions(getFilteredDimensions(dimensions))
            } catch (e) {
                console.error(e)
            }
        }

        if (userSettings.keyAnalysisDisplayProperty) {
            fetchDimensions()
        }
    }, [userSettings])

    return (
        <>
            <CssVariables colors spacers />
            <Router>
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={props => <Dashboard {...props} mode={VIEW} />}
                    />
                    <Route
                        exact
                        path="/new"
                        render={props => <Dashboard {...props} mode={NEW} />}
                    />
                    <Route
                        exact
                        path="/:dashboardId"
                        render={props => <Dashboard {...props} mode={VIEW} />}
                    />
                    <Route
                        exact
                        path="/:dashboardId/edit"
                        render={props => <Dashboard {...props} mode={EDIT} />}
                    />
                    <Route
                        exact
                        path="/:dashboardId/printoipp"
                        render={props => <Dashboard {...props} mode={PRINT} />}
                    />
                    <Route
                        exact
                        path="/:dashboardId/printlayout"
                        render={props => (
                            <Dashboard {...props} mode={PRINT_LAYOUT} />
                        )}
                    />
                </Switch>
            </Router>
            <AlertBar />
        </>
    )
}

App.propTypes = {
    fetchDashboards: PropTypes.func.isRequired,
    setControlBarRows: PropTypes.func.isRequired,
    setCurrentUser: PropTypes.func.isRequired,
    setDimensions: PropTypes.func.isRequired,
    setShowDescription: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
    fetchDashboards: tFetchDashboards,
    setControlBarRows: tSetControlBarRows,
    setCurrentUser: acReceivedUser,
    setDimensions: acSetDimensions,
    setShowDescription: tSetShowDescription,
}

export default connect(null, mapDispatchToProps)(App)
