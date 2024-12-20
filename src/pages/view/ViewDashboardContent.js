import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import LoadingMask from '../../components/LoadingMask.js'
import Notice from '../../components/Notice.js'
import { ROUTE_START_PATH } from '../start/index.js'
import { Description } from './Description.js'
import FilterBar from './FilterBar/FilterBar.js'
import ItemGrid from './ItemGrid.js'
import classes from './styles/ViewDashboard.module.css'

export const ViewDashboardContent = ({
    loading,
    loaded,
    loadFailed,
    isCached,
}) => {
    if (loading) {
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
                <FilterBar />
                <ItemGrid dashboardIsCached={isCached} />
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
    loadFailed: PropTypes.bool,
    loaded: PropTypes.bool,
    loading: PropTypes.bool,
}
