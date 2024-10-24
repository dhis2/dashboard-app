import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { VIEW, EDIT, PRINT_LAYOUT } from '../../../modules/dashboardModes.js'
import EditItemActions from './EditItemActions.jsx'
import PrintItemInfo from './PrintItemInfo.jsx'
import classes from './styles/ItemHeader.module.css'
import ViewItemActions from './ViewItemActions.jsx'
import ViewItemTags from './ViewItemTags.jsx'

const getItemActionsMap = (isShortened) => {
    return {
        [VIEW]: ViewItemActions,
        [EDIT]: EditItemActions,
        [PRINT_LAYOUT]: isShortened ? PrintItemInfo : null,
    }
}

const ItemHeader = React.forwardRef(
    ({ dashboardMode, title, isShortened, tags, ...rest }, ref) => {
        const Actions = getItemActionsMap(isShortened)[dashboardMode]
        return (
            <div className={classes.itemHeaderWrap} ref={ref}>
                <p className={classes.itemTitle}>{title}</p>
                <div className={classes.itemHeaderRightWrap}>
                    {tags ? <ViewItemTags tags={tags} /> : null}
                    {Actions ? <Actions {...rest} /> : null}
                </div>
            </div>
        )
    }
)

ItemHeader.displayName = 'ItemHeader'

ItemHeader.propTypes = {
    dashboardMode: PropTypes.string,
    isShortened: PropTypes.bool,
    tags: PropTypes.node,
    title: PropTypes.string,
}

export default connect(null, null, null, {
    forwardRef: true,
})(ItemHeader)
