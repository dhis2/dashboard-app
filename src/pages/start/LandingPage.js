import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import DashboardsBar from '../../components/DashboardsBar/index.js'
import StartScreen from './StartScreen.js'

const firstDashboardQuery = {
    dashboards: {
        resource: 'dashboards',
        params: {
            fields: 'id,favorite,displayName',
            order: 'favorite:desc,displayName:asc',
            paging: true,
            pageSize: 1,
        },
    },
}

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
