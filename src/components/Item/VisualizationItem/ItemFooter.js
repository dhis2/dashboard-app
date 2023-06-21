import { AboutAOUnit, InterpretationsWrapper } from '@dhis2/analytics'
import { useConfig } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { getVisualizationId } from '../../../modules/item.js'
import { getItemUrl } from '../../../modules/itemTypes.js'
import FatalErrorBoundary from './FatalErrorBoundary.js'
import classes from './styles/ItemFooter.module.css'

const ItemFooter = (props) => {
    const { baseUrl } = useConfig()
    const [interpretationId, setInterpretationId] = useState(null)
    const { d2 } = useD2()

    const id = getVisualizationId(props.item)
    const launchUrl = getItemUrl(props.item.type, { id }, baseUrl)

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
                    <InterpretationsWrapper
                        type={props.item.type.toLowerCase()}
                        id={id}
                        interpretationId={interpretationId}
                        currentUser={d2.currentUser}
                        onReplyIconClick={setInterpretationId}
                        onGoBackClicked={() => setInterpretationId(null)}
                        onInterpretationClick={Function.prototype}
                        launchUrl={launchUrl}
                        inlineReply={true}
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
