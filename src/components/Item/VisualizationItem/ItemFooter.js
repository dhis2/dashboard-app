import React from 'react'
import PropTypes from 'prop-types'
import { getVisualizationId } from '../../../modules/item'
import InterpretationsComponent from '@dhis2/d2-ui-interpretations'

import classes from './styles/ItemFooter.module.css'

const ItemFooter = (props, context) => (
    <div data-test="dashboarditem-footer">
        <hr className={classes.line} />
        <div className={classes.scrollContainer}>
            <InterpretationsComponent
                d2={context.d2}
                item={props.item}
                type={props.item.type.toLowerCase()}
                id={getVisualizationId(props.item)}
                appName="dashboard"
            />
        </div>
    </div>
)

ItemFooter.contextTypes = {
    d2: PropTypes.object.isRequired,
}

ItemFooter.propTypes = {
    item: PropTypes.object.isRequired,
}

export default ItemFooter
