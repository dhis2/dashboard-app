import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { acSetDashboardStarred } from '../../../actions/dashboards.js'
import { isSmallScreen } from '../../../modules/smallScreen.js'
import { sGetDashboardStarred } from '../../../reducers/dashboards.js'
import {
    sGetSelected,
    sGetSelectedIsEmbedded,
} from '../../../reducers/selected.js'
import { useWindowDimensions } from '../../WindowDimensionsProvider.js'
import ActionsBar from './ActionsBar.js'
import { apiStarDashboard } from './apiStarDashboard.js'
import ExternalSourceTag from './ExternalSourceTag.js'
import LastUpdatedTag from './LastUpdatedTag.js'
import StarDashboardButton from './StarDashboardButton.js'
import classes from './styles/InformationBlock.module.css'

const InformationBlock = ({
    id,
    isEmbeddedDashboard,
    displayName,
    starred,
    setDashboardStarred,
}) => {
    const dataEngine = useDataEngine()
    const { show: showAlert } = useAlert(
        ({ msg }) => msg,
        ({ isCritical }) =>
            isCritical ? { critical: true } : { warning: true }
    )
    const toggleDashboardStarred = useCallback(
        () =>
            apiStarDashboard(dataEngine, id, !starred)
                .then(() => {
                    setDashboardStarred(id, !starred)
                })
                .catch(() => {
                    const msg = starred
                        ? i18n.t('Failed to unstar the dashboard')
                        : i18n.t('Failed to star the dashboard')
                    showAlert({ msg, isCritical: false })
                }),
        [dataEngine, id, setDashboardStarred, showAlert, starred]
    )

    const { width } = useWindowDimensions()

    if (!id) {
        return null
    }

    return (
        <div className={classes.container}>
            <div className={classes.titleContainer} data-test="title-bar">
                <h3 className={classes.title} data-test="view-dashboard-title">
                    {displayName}
                </h3>
                <StarDashboardButton
                    starred={starred}
                    onClick={toggleDashboardStarred}
                />
                {!isSmallScreen(width) && <LastUpdatedTag id={id} />}
                {isEmbeddedDashboard && !isSmallScreen(width) && (
                    <ExternalSourceTag />
                )}
            </div>
            <ActionsBar
                toggleDashboardStarred={toggleDashboardStarred}
                starred={starred}
                showAlert={showAlert}
            />
        </div>
    )
}

InformationBlock.propTypes = {
    displayName: PropTypes.string,
    id: PropTypes.string,
    isEmbeddedDashboard: PropTypes.bool,
    setDashboardStarred: PropTypes.func,
    starred: PropTypes.bool,
}

const mapStateToProps = (state) => {
    const dashboard = sGetSelected(state)

    return {
        displayName: dashboard.displayName,
        id: dashboard.id,
        starred: dashboard.id
            ? sGetDashboardStarred(state, dashboard.id)
            : false,
        isEmbeddedDashboard: sGetSelectedIsEmbedded(state),
    }
}

export default connect(mapStateToProps, {
    setDashboardStarred: acSetDashboardStarred,
})(InformationBlock)
