import { IconDragHandle16, colors } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { VIEW, EDIT, PRINT_LAYOUT } from '../../../modules/dashboardModes.js'
import { useEditVariant } from '../../../pages/edit/EditVariant.jsx'
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
    ({ dashboardMode, title, isShortened, style, tags, ...rest }, ref) => {
        const Actions = getItemActionsMap(isShortened)[dashboardMode]
        const variant = useEditVariant()
        const isStrip = dashboardMode === EDIT && variant === 'onebar'
        return (
            <div
                className={cx(classes.itemHeaderWrap, {
                    // header strip doubles as the drag handle in edit mode
                    [`${classes.editHeader} item-drag-handle`]: isStrip,
                })}
                ref={ref}
                style={style}
            >
                {isStrip && (
                    <span className={classes.grip} aria-hidden="true">
                        <IconDragHandle16 color={colors.grey600} />
                    </span>
                )}
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
    style: PropTypes.object,
    tags: PropTypes.node,
    title: PropTypes.string,
}

export default connect(null, null, null, {
    forwardRef: true,
})(ItemHeader)
