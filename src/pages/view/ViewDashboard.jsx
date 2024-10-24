import { useDhis2ConnectionStatus, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { AlertStack, AlertBar } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { acClearEditDashboard } from '../../actions/editDashboard.js'
import { acSetPassiveViewRegistered } from '../../actions/passiveViewRegistered.js'
import { acClearPrintDashboard } from '../../actions/printDashboard.js'
import {
    tSetSelectedDashboardById,
    tSetSelectedDashboardByIdOffline,
} from '../../actions/selected.js'
import { apiPostDataStatistics } from '../../api/dataStatistics.js'
import DashboardContainer from '../../components/DashboardContainer.jsx'
import DashboardsBar from '../../components/DashboardsBar/DashboardsBar.jsx'
import LoadingMask from '../../components/LoadingMask.jsx'
import Notice from '../../components/Notice.jsx'
import { setHeaderbarVisible } from '../../modules/setHeaderbarVisible.js'
import { useCacheableSection } from '../../modules/useCacheableSection.js'
import { sGetDashboardById } from '../../reducers/dashboards.js'
import { sGetPassiveViewRegistered } from '../../reducers/passiveViewRegistered.js'
import { sGetSelectedId } from '../../reducers/selected.js'
import { ROUTE_START_PATH } from '../start/index.js'
import FilterBar from './FilterBar/FilterBar.jsx'
import ItemGrid from './ItemGrid.jsx'
import classes from './styles/ViewDashboard.module.css'
import TitleBar from './TitleBar/TitleBar.jsx'

const ViewDashboard = (props) => {
    const [controlbarExpanded, setControlbarExpanded] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [loadFailed, setLoadFailed] = useState(false)
    const { isConnected: online } = useDhis2ConnectionStatus()
    const { isCached } = useCacheableSection(props.requestedId)
    const engine = useDataEngine()

    useEffect(() => {
        setHeaderbarVisible(true)
        props.clearEditDashboard()
        props.clearPrintDashboard()
    }, [])

    useEffect(() => {
        setLoaded(false)

        Array.from(
            document.getElementsByClassName('dashboard-scroll-container')
        ).forEach((container) => {
            container.scroll(0, 0)
        })
    }, [props.requestedId])

    useEffect(() => {
        if (!props.passiveViewRegistered && online) {
            apiPostDataStatistics(
                'PASSIVE_DASHBOARD_VIEW',
                props.requestedId,
                engine
            )
                .then(() => {
                    props.registerPassiveView()
                })
                .catch((error) => console.info(error))
        }
    }, [props.passiveViewRegistered, engine])

    useEffect(() => {
        const loadDashboard = async () => {
            const alertTimeout = setTimeout(() => {
                if (props.requestedDashboardName) {
                    setLoadingMessage(
                        i18n.t('Loading dashboard – {{name}}', {
                            name: props.requestedDashboardName,
                        })
                    )
                } else {
                    setLoadingMessage(i18n.t('Loading dashboard'))
                }
            }, 500)

            try {
                await props.fetchDashboard(props.requestedId, props.username)
                setLoaded(true)
                setLoadFailed(false)
                setLoadingMessage(null)
                clearTimeout(alertTimeout)
            } catch (e) {
                setLoaded(false)
                setLoadFailed(true)
                setLoadingMessage(null)
                clearTimeout(alertTimeout)
                props.setSelectedAsOffline(props.requestedId, props.username)
            }
        }

        const requestedIsAvailable = online || isCached
        const switchingDashboard = props.requestedId !== props.currentId

        if (requestedIsAvailable && !loaded) {
            loadDashboard()
        } else if (!requestedIsAvailable && switchingDashboard) {
            setLoaded(false)
            props.setSelectedAsOffline(props.requestedId, props.username)
        }
    }, [props.requestedId, props.currentId, loaded, online])

    const onExpandedChanged = (expanded) => setControlbarExpanded(expanded)

    const getContent = () => {
        if (
            !online &&
            !isCached &&
            (props.requestedId !== props.currentId || !loaded)
        ) {
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
                                <Link
                                    to={ROUTE_START_PATH}
                                    className={classes.link}
                                >
                                    {i18n.t('Go to start page')}
                                </Link>
                            </div>
                        </>
                    }
                />
            )
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

        return props.requestedId !== props.currentId ? (
            <LoadingMask />
        ) : (
            <>
                <TitleBar />
                <FilterBar />
                <ItemGrid />
            </>
        )
    }

    return (
        <>
            <div
                className={cx(classes.container, 'dashboard-scroll-container')}
                data-test="outer-scroll-container"
            >
                <DashboardsBar
                    expanded={controlbarExpanded}
                    onExpandedChanged={onExpandedChanged}
                />
                <DashboardContainer covered={controlbarExpanded}>
                    {controlbarExpanded && (
                        <div
                            className={classes.cover}
                            onClick={() => setControlbarExpanded(false)}
                        />
                    )}
                    {getContent()}
                </DashboardContainer>
            </div>
            <AlertStack>
                {loadingMessage && (
                    <AlertBar
                        onHidden={() => setLoadingMessage(null)}
                        permanent
                    >
                        {loadingMessage}
                    </AlertBar>
                )}
            </AlertStack>
        </>
    )
}

ViewDashboard.propTypes = {
    clearEditDashboard: PropTypes.func,
    clearPrintDashboard: PropTypes.func,
    currentId: PropTypes.string,
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
