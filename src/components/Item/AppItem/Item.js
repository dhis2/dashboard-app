import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import NotInterestedIcon from '@material-ui/icons/NotInterested'

import ItemHeader from '../ItemHeader/ItemHeader'
import Line from '../../../widgets/Line'

import { sGetOuItemFilters } from '../../../reducers/itemFilters'

import { isEditMode } from '../../Dashboard/dashboardModes'

const getIframeSrc = (appDetails, item, ouItemFilters) => {
    let iframeSrc = `${appDetails.launchUrl}?dashboardItemId=${item.id}`

    if (ouItemFilters && ouItemFilters.length) {
        const ouIds = ouItemFilters.map(
            ouFilter => ouFilter.path.split('/').slice(-1)[0]
        )

        iframeSrc += `&userOrgUnit=${ouIds.join(',')}`
    }

    return iframeSrc
}

const AppItem = ({ dashboardMode, item, ouItemFilters }, context) => {
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
                isShortened={item.shortened}
            />
            <Line />
            <iframe
                title={appDetails.name}
                src={getIframeSrc(appDetails, item, ouItemFilters)}
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
    ouItemFilters: PropTypes.array,
}

AppItem.contextTypes = {
    d2: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => {
    const ouItemFilters = !isEditMode(ownProps.dashboardMode)
        ? sGetOuItemFilters(state)
        : undefined

    return { ouItemFilters }
}

export default connect(mapStateToProps)(AppItem)
