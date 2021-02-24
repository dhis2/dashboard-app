import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import classes from './styles/DashboardContainer.module.css'

const DashboardContainer = ({ children, covered }) => {
    return (
        <div
            className={cx(
                classes.container,
                'dashboard-scroll-container',
                covered && classes.covered
            )}
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
