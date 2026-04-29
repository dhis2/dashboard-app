import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ExternalSourceTag from '../../components/DashboardsBar/InformationBlock/ExternalSourceTag.jsx'
import LoadingMask from '../../components/LoadingMask.jsx'
import Notice from '../../components/Notice.jsx'
import { useWindowDimensions } from '../../components/WindowDimensionsProvider.jsx'
import { isSmallScreen } from '../../modules/smallScreen.js'
import { sGetSelectedIsEmbedded } from '../../reducers/selected.js'
import { ROUTE_START_PATH } from '../start/index.js'
import { Description } from './Description.jsx'
import FilterBar from './FilterBar/FilterBar.jsx'
import ItemGrid from './ItemGrid.jsx'
import classes from './styles/ViewDashboard.module.css'
import { SupersetDashboard } from './SupersetDashboard.jsx'

export const ViewDashboardContent = ({
    initialized,
    loading,
    loaded,
    loadFailed,
    isCached,
}) => {
    const isEmbeddedDashboard = useSelector(sGetSelectedIsEmbedded)
    const { width } = useWindowDimensions()

    // Show a loading mask while loading, or before the load effect has had a
    // chance to fire (initialized is false). This prevents the offline Notice
    // from flashing briefly when returning from print preview. (DHIS2-19271)
    if (loading || !initialized) {
        return <LoadingMask />
    }

    if (loadFailed) {
        return (
            <Notice
                title={i18n.t('Load dashboard failed')}
                message={i18n.t(
                    'This dashboard could not be loaded. Please try again later.'
                )}
            />
        )
    }

    if (loaded) {
        return (
            <>
                <Description />
                {!isEmbeddedDashboard && <FilterBar />}
                {isEmbeddedDashboard ? (
                    <>
                        {isSmallScreen(width) && <ExternalSourceTag />}
                        <SupersetDashboard />
                    </>
                ) : (
                    <ItemGrid dashboardIsCached={isCached} />
                )}
            </>
        )
    }

    return (
        <Notice
            title={i18n.t('Offline')}
            message={
                <>
                    <p>
                        {i18n.t(
                            'This dashboard cannot be loaded while offline.'
                        )}
                    </p>
                    <div>
                        <Link to={ROUTE_START_PATH} className={classes.link}>
                            {i18n.t('Go to start page')}
                        </Link>
                    </div>
                </>
            }
        />
    )
}

ViewDashboardContent.propTypes = {
    isCached: PropTypes.bool,
    initialized: PropTypes.bool,
    loadFailed: PropTypes.bool,
    loaded: PropTypes.bool,
    loading: PropTypes.bool,
}
