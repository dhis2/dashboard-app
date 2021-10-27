import PropTypes from 'prop-types'
import React, { useState } from 'react'
import DashboardsBar from '../../components/DashboardsBar/DashboardsBar'
import StartScreen from './StartScreen'

const LandingPage = ({ username }) => {
    const [controlbarExpanded, setControlbarExpanded] = useState(false)

    return (
        <>
            <DashboardsBar
                expanded={controlbarExpanded}
                onExpandedChanged={expanded => setControlbarExpanded(expanded)}
            />
            <StartScreen username={username} />
        </>
    )
}

LandingPage.propTypes = {
    username: PropTypes.string,
}

export default LandingPage
