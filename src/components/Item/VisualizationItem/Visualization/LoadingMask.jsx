import { CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/LoadingMask.module.css'

const LoadingMask = ({ style }) => {
    return (
        <div className={classes.center} style={style}>
            <CircularLoader />
        </div>
    )
}

LoadingMask.propTypes = {
    style: PropTypes.object,
}

export default LoadingMask
