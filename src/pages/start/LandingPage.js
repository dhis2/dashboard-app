import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import DashboardsBar from '../../components/DashboardsBar/DashboardsBar'
import StartScreen from './StartScreen'

const LandingPage = ({ username, onMount }) => {
    const [controlbarExpanded, setControlbarExpanded] = useState(false)

    useEffect(() => {
        onMount()
    }, [])

    return (
        <>
            <DashboardsBar
                expanded={controlbarExpanded}
                onExpandedChanged={(expanded) =>
                    setControlbarExpanded(expanded)
                }
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
