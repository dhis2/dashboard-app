import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import {
    Layer,
    CenteredContent,
    CircularLoader,
    ComponentCover,
    AlertStack,
    AlertBar,
} from '@dhis2/ui'
import cx from 'classnames'
import { useOnlineStatus } from '../../modules/useOnlineStatus'
import { useCacheableSectionStatus } from '../../modules/useCacheableSectionStatus'

import { TitleBar } from './TitleBar'
import ItemGrid from './ItemGrid'
import FilterBar from './FilterBar/FilterBar'
import DashboardsBar from './DashboardsBar/DashboardsBar'

import DashboardContainer from '../../components/DashboardContainer'
import Notice from '../../components/Notice'

import { sGetPassiveViewRegistered } from '../../reducers/passiveViewRegistered'
import { sGetDashboardById } from '../../reducers/dashboards'
import {
    sGetSelectedId,
    sGetIsNullDashboardItems,
} from '../../reducers/selected'
import { acClearEditDashboard } from '../../actions/editDashboard'
import { acClearPrintDashboard } from '../../actions/printDashboard'
import { acSetIsRecording } from '../../actions/isRecording'
import {
    tSetSelectedDashboardById,
    tSetSelectedDashboardByIdOffline,
} from '../../actions/selected'
import { acSetPassiveViewRegistered } from '../../actions/passiveViewRegistered'

import { apiPostDataStatistics } from '../../api/dataStatistics'
import { setHeaderbarVisible } from '../../modules/setHeaderbarVisible'

import classes from './styles/ViewDashboard.module.css'

const ViewDashboard = props => {
    const [controlbarExpanded, setControlbarExpanded] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState(null)
    const [selectedIsLoaded, setSelectedIsLoaded] = useState(false)
    const { isOnline } = useOnlineStatus()
    const { lastUpdated: isCached } = useCacheableSectionStatus(props.id)

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
        if (props.isRecording) {
            props.setIsRecording(false)
        }
    }, [props.isRecording])

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
            clearTimeout(alertTimeout)
        }

        if (
            (isOnline && props.isRecording) ||
            (isOnline && !props.isLoaded) ||
            (isOnline && props.nullDashboardItems) ||
            (!isOnline && isCached && !props.isLoaded)
        ) {
            // online and recording, or
            // online and switched to a new dashboard, or
            // just went online and the uncached dashboard can now load or
            // offline and switched to a cached dashboard
            loadDashboard()
            setSelectedIsLoaded(true)
        } else if (!isOnline && !isCached && !props.isLoaded) {
            // While offline, you switched to an uncached dashboard
            // So go ahead and switch "selected" but leave all properties
            // except 'id' empty

            setSelectedIsLoaded(false)
            // this sets dashboardItems to Null
            props.setSelectedAsOffline(props.id, props.username)
        }
    }, [props.id, props.isRecording, isOnline, props.isLoaded])

    const onExpandedChanged = expanded => setControlbarExpanded(expanded)

    console.log(
        `loaded: ${props.isLoaded}, selectedIsLoaded: ${selectedIsLoaded}`
    )
    const getContent = () => {
        if (!isOnline && !props.isLoaded && !isCached) {
            return (
                <Notice
                    title={i18n.t('Offline')}
                    message={i18n.t(
                        'This dashboard cannot be loaded while offline. AAA'
                    )}
                />
            )
        }

        if (isOnline && !selectedIsLoaded) {
            return (
                <Layer translucent>
                    <CenteredContent>
                        <CircularLoader />
                    </CenteredContent>
                </Layer>
            )
        }

        if (selectedIsLoaded) {
            return (
                <>
                    <TitleBar />
                    <FilterBar />
                    <ItemGrid isRecording={props.isRecording} />
                </>
            )
        }

        return (
            <Notice
                title={i18n.t('Offline')}
                message={i18n.t(
                    'This dashboard cannot be loaded while offline.'
                )}
            />
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
    isLoaded: PropTypes.bool,
    isRecording: PropTypes.bool,
    name: PropTypes.string,
    nullDashboardItems: PropTypes.bool,
    passiveViewRegistered: PropTypes.bool,
    registerPassiveView: PropTypes.func,
    setIsRecording: PropTypes.func,
    setSelectedAsOffline: PropTypes.func,
    username: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => {
    const dashboard = sGetDashboardById(state, ownProps.id) || {}

    return {
        passiveViewRegistered: sGetPassiveViewRegistered(state),
        name: dashboard.displayName || null,
        isLoaded: sGetSelectedId(state) === ownProps.id,
        nullDashboardItems: sGetIsNullDashboardItems(state),
    }
}

export default connect(mapStateToProps, {
    clearEditDashboard: acClearEditDashboard,
    clearPrintDashboard: acClearPrintDashboard,
    registerPassiveView: acSetPassiveViewRegistered,
    fetchDashboard: tSetSelectedDashboardById,
    setSelectedAsOffline: tSetSelectedDashboardByIdOffline,
    setIsRecording: acSetIsRecording,
})(ViewDashboard)
