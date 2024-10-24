import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/DashboardContainer.module.css'

const DashboardContainer = ({ children, covered }) => {
    return (
        <div
            className={cx(
                classes.container,
                'dashboard-scroll-container',
                covered && classes.covered
            )}
            data-test="inner-scroll-container"
        >
            {children}
        </div>
    )
}

DashboardContainer.propTypes = {
    children: PropTypes.node,
    covered: PropTypes.bool,
}

export default DashboardContainer
