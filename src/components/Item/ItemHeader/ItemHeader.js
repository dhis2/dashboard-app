import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { VIEW, EDIT, PRINT_LAYOUT } from '../../../modules/dashboardModes'
import EditItemActions from './EditItemActions'
import PrintItemInfo from './PrintItemInfo'
import classes from './styles/ItemHeader.module.css'
import ViewItemActions from './ViewItemActions.js'
import ViewItemTags from './ViewItemTags.js'

const getItemActionsMap = isShortened => {
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
