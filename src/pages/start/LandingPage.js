import PropTypes from 'prop-types'
import React from 'react'
import StartScreen from './StartScreen'

const LandingPage = ({ username }) => {
    return (
        <div>
            <div>Dashboards bar</div>
            <StartScreen username={username} />
        </div>
    )
}

LandingPage.propTypes = {
    username: PropTypes.string,
}

export default LandingPage
