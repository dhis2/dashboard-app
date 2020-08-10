import React from 'react'
import PropTypes from 'prop-types'

import classes from './styles/ItemHeader.module.css'

const ViewItemActions = ({ actionButtons }) => {
    return actionButtons ? (
        <div className={classes.itemActionsWrap}>{actionButtons}</div>
    ) : null
}

ViewItemActions.propTypes = {
    actionButtons: PropTypes.node,
}

export default ViewItemActions
