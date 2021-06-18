import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ViewItemActions from './ViewItemActions'
import EditItemActions from './EditItemActions'
import PrintItemInfo from './PrintItemInfo'

import { VIEW, EDIT, PRINT_LAYOUT } from '../../../modules/dashboardModes'
import { DashboardModeContext } from '../../../components/DashboardModeProvider'

import classes from './styles/ItemHeader.module.css'

const getItemActionsMap = isShortened => {
    return {
        [VIEW]: ViewItemActions,
        [EDIT]: EditItemActions,
        [PRINT_LAYOUT]: isShortened ? PrintItemInfo : null,
    }
}

const ItemHeader = React.forwardRef(({ title, isShortened, ...rest }, ref) => {
    const dashboardMode = useContext(DashboardModeContext)
    const Actions = getItemActionsMap(isShortened)[dashboardMode]

    return (
        <div className={classes.itemHeaderWrap} ref={ref}>
            <p className={classes.itemTitle}>{title}</p>
            {Actions ? <Actions {...rest} /> : null}
        </div>
    )
})

ItemHeader.displayName = 'ItemHeader'

ItemHeader.propTypes = {
    isShortened: PropTypes.bool,
    title: PropTypes.string,
}

export default connect(null, null, null, {
    forwardRef: true,
})(ItemHeader)
