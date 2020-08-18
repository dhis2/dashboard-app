import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import NotInterestedIcon from '@material-ui/icons/NotInterested'

import { FILTER_ORG_UNIT } from '../../../actions/itemFilters'
import { sGetItemFiltersRoot } from '../../../reducers/itemFilters'
import ItemHeader from '../ItemHeader/ItemHeader'
import Line from '../../../widgets/Line'

import { isEditMode } from '../../Dashboard/dashboardModes'

const getIframeSrc = (appDetails, item, itemFilters) => {
    let iframeSrc = `${appDetails.launchUrl}?dashboardItemId=${item.id}`

    if (
        itemFilters &&
        itemFilters[FILTER_ORG_UNIT] &&
        itemFilters[FILTER_ORG_UNIT].length
    ) {
        const ouIds = itemFilters[FILTER_ORG_UNIT].map(
            ouPath => ouPath.split('/').slice(-1)[0]
        )

        iframeSrc += `&userOrgUnit=${ouIds.join(',')}`
    }

    return iframeSrc
}

const AppItem = ({ dashboardMode, item, itemFilters }, context) => {
    let appDetails

    const appKey = item.appKey

    if (appKey) {
        appDetails = context.d2.system.installedApps.find(
            app => app.key === appKey
        )
    }

    return appDetails && appDetails.name && appDetails.launchUrl ? (
        <>
            <ItemHeader
                title={appDetails.name}
                itemId={item.id}
                dashboardMode={dashboardMode}
            />
            <Line />
            <iframe
                title={appDetails.name}
                src={getIframeSrc(appDetails, item, itemFilters)}
                className="dashboard-item-content"
                style={{ border: 'none' }}
            />
        </>
    ) : (
        <>
            <ItemHeader title={`${appKey} app not found`} />
            <Line />
            <div
                className="dashboard-item-content"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '90%',
                }}
            >
                <NotInterestedIcon
                    color="disabled"
                    disabled
                    style={{ width: 100, height: 100, align: 'center' }}
                />
            </div>
        </>
    )
}

AppItem.propTypes = {
    dashboardMode: PropTypes.string,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
}

AppItem.contextTypes = {
    d2: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => {
    const itemFilters = !isEditMode(ownProps.dashboardMode)
        ? sGetItemFiltersRoot(state)
        : {}

    return { itemFilters }
}

export default connect(mapStateToProps)(AppItem)
