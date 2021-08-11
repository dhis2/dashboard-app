import { useOnlineStatus, useCacheableSection } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { ComponentCover, AlertStack, AlertBar } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { acClearEditDashboard } from '../../actions/editDashboard'
import { acSetPassiveViewRegistered } from '../../actions/passiveViewRegistered'
import { acClearPrintDashboard } from '../../actions/printDashboard'
import {
    tSetSelectedDashboardById,
    tSetSelectedDashboardByIdOffline,
} from '../../actions/selected'
import { apiPostDataStatistics } from '../../api/dataStatistics'
import DashboardContainer from '../../components/DashboardContainer'
import LoadingMask from '../../components/LoadingMask'
import Notice from '../../components/Notice'
import { setHeaderbarVisible } from '../../modules/setHeaderbarVisible'
import { sGetDashboardById } from '../../reducers/dashboards'
import { sGetPassiveViewRegistered } from '../../reducers/passiveViewRegistered'
import { sGetSelectedId } from '../../reducers/selected'
import DashboardsBar from './DashboardsBar/DashboardsBar'
import FilterBar from './FilterBar/FilterBar'
import ItemGrid from './ItemGrid'
import classes from './styles/ViewDashboard.module.css'
import { TitleBar } from './TitleBar'

const ViewDashboard = props => {
    const [controlbarExpanded, setControlbarExpanded] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState(null)
    const [selectedIsLoaded, setSelectedIsLoaded] = useState(false)
    const [forceLoadCount, setForceLoadCount] = useState(0)
    const { online } = useOnlineStatus()
    const { isCached, recordingState } = useCacheableSection(props.id)

    const dashboardIsAvailable = online || isCached

    useEffect(() => {
        setHeaderbarVisible(true)
        props.clearEditDashboard()
        props.clearPrintDashboard()
    }, [])

    useEffect(() => {
        Array.from(
            document.getElementsByClassName('dashboard-scroll-container')
        ).forEach(container => {
            container.scroll(0, 0)
        })
    }, [props.id])

    useEffect(() => {
        if (!props.passiveViewRegistered) {
            apiPostDataStatistics('PASSIVE_DASHBOARD_VIEW', props.id)
                .then(() => {
                    props.registerPassiveView()
                })
                .catch(error => console.info(error))
        }
    }, [props.passiveViewRegistered])

    useEffect(() => {
        const loadDashboard = async () => {
            const alertTimeout = setTimeout(() => {
                if (props.name) {
                    setLoadingMessage(
                        i18n.t('Loading dashboard – {{name}}', {
                            name: props.name,
                        })
                    )
                } else {
                    setLoadingMessage(i18n.t('Loading dashboard'))
                }
            }, 500)

            await props.fetchDashboard(props.id, props.username)

            setLoadingMessage(null)
            setSelectedIsLoaded(true)
            clearTimeout(alertTimeout)
        }

        if (
            dashboardIsAvailable &&
            (recordingState === 'recording' ||
                props.isDifferentDashboard ||
                !selectedIsLoaded)
        ) {
            loadDashboard()
        } else if (!dashboardIsAvailable && props.isDifferentDashboard) {
            setSelectedIsLoaded(false)
            props.setSelectedAsOffline(props.id, props.username)
        }
    }, [props.id, recordingState, online, props.isDifferentDashboard])

    useEffect(() => {
        if (recordingState === 'recording') {
            setForceLoadCount(forceLoadCount + 1)
        }
    }, [recordingState])

    const onExpandedChanged = expanded => setControlbarExpanded(expanded)

    const getContent = () => {
        if (
            !dashboardIsAvailable &&
            (props.isDifferentDashboard || !selectedIsLoaded)
        ) {
            return (
                <Notice
                    title={i18n.t('Offline')}
                    message={i18n.t(
                        'This dashboard cannot be loaded while offline.'
                    )}
                />
            )
        }

        return !selectedIsLoaded ? (
            <LoadingMask />
        ) : (
            <>
                <TitleBar />
                <FilterBar />
                <ItemGrid forceLoadCount={forceLoadCount} />
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
                        <ComponentCover
                            className={classes.cover}
                            translucent
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
    fetchDashboard: PropTypes.func,
    id: PropTypes.string,
    isDifferentDashboard: PropTypes.bool,
    name: PropTypes.string,
    passiveViewRegistered: PropTypes.bool,
    registerPassiveView: PropTypes.func,
    setSelectedAsOffline: PropTypes.func,
    username: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => {
    const dashboard = sGetDashboardById(state, ownProps.id) || {}

    return {
        passiveViewRegistered: sGetPassiveViewRegistered(state),
        name: dashboard.displayName || null,
        isDifferentDashboard: sGetSelectedId(state) !== ownProps.id,
    }
}

export default connect(mapStateToProps, {
    clearEditDashboard: acClearEditDashboard,
    clearPrintDashboard: acClearPrintDashboard,
    registerPassiveView: acSetPassiveViewRegistered,
    fetchDashboard: tSetSelectedDashboardById,
    setSelectedAsOffline: tSetSelectedDashboardByIdOffline,
})(ViewDashboard)
