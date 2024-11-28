import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import DashboardsBar from '../../components/DashboardsBar/index.js'
import StartScreen from './StartScreen.js'

const LandingPage = ({ username, onMount }) => {
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
