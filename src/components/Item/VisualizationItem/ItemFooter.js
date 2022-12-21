import { useOnlineStatus } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import InterpretationsComponent from '@dhis2/d2-ui-interpretations'
import PropTypes from 'prop-types'
import React from 'react'
import { getVisualizationId } from '../../../modules/item.js'
import FatalErrorBoundary from './FatalErrorBoundary.js'
import classes from './styles/ItemFooter.module.css'

const ItemFooter = (props) => {
    const { d2 } = useD2()
    const { offline } = useOnlineStatus()

    return (
        <div className={classes.itemFooter} data-test="dashboarditem-footer">
            <hr className={classes.line} />
            <div className={classes.scrollContainer}>
                <FatalErrorBoundary
                    message={i18n.t(
                        'There was a problem loading interpretations for this item'
                    )}
                >
                    <InterpretationsComponent
                        d2={d2}
                        item={props.item}
                        type={props.item.type.toLowerCase()}
                        id={getVisualizationId(props.item)}
                        appName="dashboard"
                        isOffline={offline}
                    />
                </FatalErrorBoundary>
            </div>
        </div>
    )
}

ItemFooter.propTypes = {
    item: PropTypes.object.isRequired,
}

export default ItemFooter
