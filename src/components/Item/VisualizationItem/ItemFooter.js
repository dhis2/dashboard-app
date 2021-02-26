import React from 'react'
import PropTypes from 'prop-types'
import { getVisualizationId } from '../../../modules/item'
import InterpretationsComponent from '@dhis2/d2-ui-interpretations'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'

import classes from './styles/ItemFooter.module.css'

const ItemFooter = props => {
    const { d2 } = useD2()
    return (
        <div data-test="dashboarditem-footer">
            <hr className={classes.line} />
            <div className={classes.scrollContainer}>
                <InterpretationsComponent
                    d2={d2}
                    item={props.item}
                    type={props.item.type.toLowerCase()}
                    id={getVisualizationId(props.item)}
                    appName="dashboard"
                />
            </div>
        </div>
    )
}

ItemFooter.propTypes = {
    item: PropTypes.object.isRequired,
}

export default ItemFooter
