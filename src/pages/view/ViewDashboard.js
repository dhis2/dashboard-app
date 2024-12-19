import {
    useAlert,
    useDhis2ConnectionStatus,
    useDataEngine,
} from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { acClearEditDashboard } from '../../actions/editDashboard.js'
import { acSetPassiveViewRegistered } from '../../actions/passiveViewRegistered.js'
import { acClearPrintDashboard } from '../../actions/printDashboard.js'
import {
    tSetSelectedDashboardById,
    tSetSelectedDashboardByIdOffline,
} from '../../actions/selected.js'
import { apiPostDataStatistics } from '../../api/dataStatistics.js'
import DashboardContainer from '../../components/DashboardContainer.js'
import DashboardsBar from '../../components/DashboardsBar/index.js'
import { setHeaderbarVisible } from '../../modules/setHeaderbarVisible.js'
import { useCacheableSection } from '../../modules/useCacheableSection.js'
import { sGetDashboardById } from '../../reducers/dashboards.js'
import { sGetPassiveViewRegistered } from '../../reducers/passiveViewRegistered.js'
import { sGetSelectedId } from '../../reducers/selected.js'
import classes from './styles/ViewDashboard.module.css'
import { ViewDashboardContent } from './ViewDashboardContent.js'

const ViewDashboard = ({
    clearEditDashboard,
    clearPrintDashboard,
    fetchDashboard,
    passiveViewRegistered,
    registerPassiveView,
    requestedDashboardName,
    requestedId,
    setSelectedAsOffline,
    username,
}) => {
    const alertTimeoutRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [loadFailed, setLoadFailed] = useState(false)
    const { isConnected: online } = useDhis2ConnectionStatus()
    const { isCached } = useCacheableSection(requestedId)
    const engine = useDataEngine()
    const { show: showAlert, hide: hideAlert } = useAlert(
        ({ message }) => message
    )
    const loadDashboard = useCallback(async () => {
        setLoading(true)

        alertTimeoutRef.current = setTimeout(() => {
            const message = requestedDashboardName
                ? i18n.t('Loading dashboard – {{name}}', {
                      name: requestedDashboardName,
                  })
                : i18n.t('Loading dashboard')
            showAlert({ message })
        }, 500)

        try {
            await fetchDashboard(requestedId, username)
            setLoaded(true)
        } catch (e) {
            setLoadFailed(true)
            setSelectedAsOffline(requestedId, username)
        } finally {
            setLoading(false)
            clearTimeout(alertTimeoutRef.current)
        }
    }, [
        fetchDashboard,
        requestedDashboardName,
        requestedId,
        setSelectedAsOffline,
        showAlert,
        username,
    ])

    useEffect(() => {
        if (!loading && !loaded && !loadFailed) {
            setHeaderbarVisible(true)
            clearEditDashboard()
            clearPrintDashboard()
            if (online || isCached) {
                loadDashboard()
            } else {
                setSelectedAsOffline(requestedId, username)
            }
        }
    }, [
        clearEditDashboard,
        clearPrintDashboard,
        isCached,
        loadDashboard,
        loaded,
        loadFailed,
        loading,
        online,
        requestedId,
        setSelectedAsOffline,
        username,
    ])

    useEffect(() => {
        if (!passiveViewRegistered && online) {
            apiPostDataStatistics('PASSIVE_DASHBOARD_VIEW', requestedId, engine)
                .then(() => {
                    registerPassiveView()
                })
                .catch((error) => console.info(error))
        }
    }, [
        engine,
        online,
        passiveViewRegistered,
        registerPassiveView,
        requestedId,
    ])

    /* Cleanup effect: Hide current alert and prevent pending alert
     * from showing after the component unmounts due to navigation */
    useEffect(
        () => () => {
            hideAlert()
            clearTimeout(alertTimeoutRef.current)
        },
        [hideAlert]
    )

    return (
        <div
            className={cx(classes.container, 'dashboard-scroll-container')}
            data-test="outer-scroll-container"
        >
            <DashboardsBar />
            <DashboardContainer>
                <ViewDashboardContent
                    isCached={isCached}
                    loading={loading}
                    loaded={loaded}
                    loadFailed={loadFailed}
                />
            </DashboardContainer>
        </div>
    )
}

ViewDashboard.propTypes = {
    clearEditDashboard: PropTypes.func,
    clearPrintDashboard: PropTypes.func,
    fetchDashboard: PropTypes.func,
    passiveViewRegistered: PropTypes.bool,
    registerPassiveView: PropTypes.func,
    requestedDashboardName: PropTypes.string,
    requestedId: PropTypes.string,
    setSelectedAsOffline: PropTypes.func,
    username: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => {
    const dashboard = sGetDashboardById(state, ownProps.requestedId) || {}

    return {
        passiveViewRegistered: sGetPassiveViewRegistered(state),
        requestedDashboardName: dashboard.displayName || null,
        currentId: sGetSelectedId(state),
    }
}

export default connect(mapStateToProps, {
    clearEditDashboard: acClearEditDashboard,
    clearPrintDashboard: acClearPrintDashboard,
    registerPassiveView: acSetPassiveViewRegistered,
    fetchDashboard: tSetSelectedDashboardById,
    setSelectedAsOffline: tSetSelectedDashboardByIdOffline,
})(ViewDashboard)
