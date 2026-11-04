import { AboutAOUnit, DashboardItemInterpretations } from '@dhis2/analytics'
import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { getVisualizationId } from '../../../modules/item.js'
import { getItemUrl, itemTypeMap } from '../../../modules/itemTypes.js'
import { useCurrentUser } from '../../AppDataProvider/AppDataProvider.jsx'
import FatalErrorBoundary from '../FatalErrorBoundary.jsx'
import classes from './styles/ItemFooter.module.css'

const ItemFooter = ({ item }) => {
    const { baseUrl } = useConfig()
    const currentUser = useCurrentUser()
    const id = getVisualizationId(item)
    const type = itemTypeMap[item.type]?.propName
    const dashboardRedirectUrl = getItemUrl(item.type, { id }, baseUrl)

    return (
        <div className={classes.itemFooter} data-test="dashboarditem-footer">
            <hr className={classes.line} />
            <div className={classes.scrollContainer}>
                <FatalErrorBoundary
                    message={i18n.t(
                        'There was a problem loading details for this item'
                    )}
                >
                    <AboutAOUnit
                        type={itemTypeMap[item.type]?.propName}
                        id={id}
                    />
                    <DashboardItemInterpretations
                        currentUser={currentUser}
                        dashboardRedirectUrl={dashboardRedirectUrl}
                        id={id}
                        type={type}
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
