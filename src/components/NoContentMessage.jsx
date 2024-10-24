import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/NoContentMessage.module.css'

const NoContentMessage = ({ text }) => (
    <div className={classes.container}>{text}</div>
)

NoContentMessage.propTypes = {
    text: PropTypes.string,
}

export default NoContentMessage
