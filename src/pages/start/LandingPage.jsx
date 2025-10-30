import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { firstDashboardQuery } from '../../api/fetchDashboards.js'
import DashboardsBar from '../../components/DashboardsBar/index.js'
import StartScreen from './StartScreen.jsx'

const LandingPage = ({ username, onMount }) => {
    const { data } = useDataQuery(firstDashboardQuery)

    useEffect(() => {
        onMount()
    }, [onMount])

    return (
        <>
            <DashboardsBar
                hasDashboards={!!data?.dashboards.dashboards.length}
            />
            <StartScreen username={username} />
        </>
    )
}

LandingPage.propTypes = {
    username: PropTypes.string,
    onMount: PropTypes.func,
}

export default LandingPage
