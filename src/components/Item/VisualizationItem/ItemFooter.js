import { AboutAOUnit, InterpretationsUnit } from '@dhis2/analytics'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { getVisualizationId } from '../../../modules/item.js'
import FatalErrorBoundary from './FatalErrorBoundary.js'
import classes from './styles/ItemFooter.module.css'

const ItemFooter = (props) => {
    const { d2 } = useD2()
    const id = getVisualizationId(props.item)

    console.log('currentuser', d2.currentUser)
    console.log('type', props.item.type.toLowerCase())
    return (
        <div className={classes.itemFooter} data-test="dashboarditem-footer">
            <hr className={classes.line} />
            <div className={classes.scrollContainer}>
                <FatalErrorBoundary
                    message={i18n.t(
                        'There was a problem loading interpretations for this item'
                    )}
                >
                    <AboutAOUnit type="visualization" id={id} />
                    <InterpretationsUnit
                        // ref={interpretationsUnitRef}
                        type={props.item.type.toLowerCase()}
                        id={id}
                        currentUser={d2.currentUser}
                        // onInterpretationClick={(interpretationId) =>
                        //     navigateToOpenModal(interpretationId)
                        // }
                        // onReplyIconClick={(interpretationId) =>
                        //     navigateToOpenModal(interpretationId, true)
                        // }
                        // disabled={disabled}
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
