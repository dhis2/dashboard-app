import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ViewItemActions from './ViewItemActions'
import EditItemActions from './EditItemActions'
import { VIEW, EDIT } from '../../Dashboard/dashboardModes'

import classes from './styles/ItemHeader.module.css'

const itemActionsMap = {
    [VIEW]: ViewItemActions,
    [EDIT]: EditItemActions,
}

// This is the margin-top + margin-bottom defined in the css file
export const HEADER_MARGIN_HEIGHT = 12

const ItemHeader = React.forwardRef(
    ({ dashboardMode, title, ...rest }, ref) => {
        const Actions = itemActionsMap[dashboardMode]
        return (
            <div className={classes.itemHeaderWrap} ref={ref}>
                <p className={classes.itemTitle}>{title}</p>
                {Actions ? <Actions {...rest} /> : null}
            </div>
        )
    }
)

ItemHeader.displayName = 'ItemHeader'

ItemHeader.propTypes = {
    dashboardMode: PropTypes.string,
    title: PropTypes.string,
}

export default connect(null, null, null, {
    forwardRef: true,
})(ItemHeader)
