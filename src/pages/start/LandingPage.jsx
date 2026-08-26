import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import DashboardsBar from '../../components/DashboardsBar/index.js'
import StartScreen from './StartScreen.jsx'

const LandingPage = ({ username, onMount }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        onMount()
    }, [])

    return (
        <>
            <DashboardsBar />
            <StartScreen username={username} />
        </>
    )
}

LandingPage.propTypes = {
    username: PropTypes.string,
    onMount: PropTypes.func,
}

export default LandingPage
