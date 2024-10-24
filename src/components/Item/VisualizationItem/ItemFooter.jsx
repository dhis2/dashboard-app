import {
    AboutAOUnit,
    InterpretationsUnit,
    useCachedDataQuery,
} from '@dhis2/analytics'
import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { getVisualizationId } from '../../../modules/item.js'
import { getItemUrl, itemTypeMap } from '../../../modules/itemTypes.js'
import FatalErrorBoundary from './FatalErrorBoundary.jsx'
import { InterpretationReplyForm } from './InterpretationReplyForm.jsx'
import classes from './styles/ItemFooter.module.css'

const ItemFooter = ({ item }) => {
    const { baseUrl } = useConfig()
    const [interpretationId, setInterpretationId] = useState(null)
    const [replyInitialFocus, setReplyInitialFocus] = useState(false)
    const { currentUser } = useCachedDataQuery()

    const setReplyToInterpretation = (id) => {
        setInterpretationId(id)
        setReplyInitialFocus(true)
    }
    const clearInterpretation = () => {
        setInterpretationId(null)
        setReplyInitialFocus(false)
    }

    const setViewInterpretation = (id) => {
        setInterpretationId(id)
        setReplyInitialFocus(false)
    }

    const id = getVisualizationId(item)
    const dashboardRedirectUrl = getItemUrl(item.type, { id }, baseUrl)

    return (
        <div className={classes.itemFooter} data-test="dashboarditem-footer">
            <hr className={classes.line} />
            <div className={classes.scrollContainer}>
                <FatalErrorBoundary
                    message={i18n.t(
                        'There was a problem loading interpretations for this item'
                    )}
                >
                    <AboutAOUnit
                        type={itemTypeMap[item.type]?.propName}
                        id={id}
                    />
                    {interpretationId ? (
                        <InterpretationReplyForm
                            currentUser={currentUser}
                            interpretationId={interpretationId}
                            dashboardRedirectUrl={dashboardRedirectUrl}
                            onGoBackClicked={clearInterpretation}
                            onInterpretationDeleted={Function.prototype}
                            initialFocus={replyInitialFocus}
                        />
                    ) : (
                        <InterpretationsUnit
                            currentUser={currentUser}
                            type={itemTypeMap[item.type]?.propName}
                            id={id}
                            dashboardRedirectUrl={dashboardRedirectUrl}
                            onInterpretationClick={setViewInterpretation}
                            onReplyIconClick={setReplyToInterpretation}
                        />
                    )}
                </FatalErrorBoundary>
            </div>
        </div>
    )
}

ItemFooter.propTypes = {
    item: PropTypes.object.isRequired,
}

export default ItemFooter
