import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader, NoticeBox } from '@dhis2/ui'
import { embedDashboard } from '@superset-ui/embedded-sdk'
import cx from 'classnames'
import React, { useCallback, useEffect, useReducer, useRef } from 'react'
import { useSelector } from 'react-redux'
import { usePostSupersetGuestToken } from '../../api/supersetGateway.js'
import { useSupersetBaseUrl } from '../../components/SystemSettingsProvider.js'
import {
    sGetSelectedId,
    sGetSelectedSupersetEmbedData,
} from '../../reducers/selected.js'
import styles from './styles/EmbeddedSupersetDashboard.module.css'

const LOAD_INIT = 'LOAD_INIT'
const LOAD_SUCCESS = 'LOAD_SUCCESS'
const LOAD_ERROR = 'LOAD_ERROR'
const LOAD_RESET = 'LOAD_RESET'
const initialLoadState = {
    loading: false,
    error: undefined,
    success: false,
}
const reducer = (state, action) => {
    switch (action.type) {
        case LOAD_INIT:
            return { ...initialLoadState, loading: true }
        case LOAD_SUCCESS:
            return { ...initialLoadState, success: true }
        case LOAD_ERROR:
            return { ...initialLoadState, error: action.payload }
        case LOAD_RESET:
            return { ...initialLoadState }
        default:
            return state
    }
}

export const EmbeddedSupersetDashboard = () => {
    const [{ loading, error, success }, dispatch] = useReducer(
        reducer,
        initialLoadState
    )
    const ref = useRef(null)
    const selectedId = useSelector(sGetSelectedId)
    const embedData = useSelector(sGetSelectedSupersetEmbedData)
    const supersetDomain = useSupersetBaseUrl()
    const postSupersetGuestToken = usePostSupersetGuestToken(selectedId)
    const loadEmbeddedSupersetDashboard = useCallback(async () => {
        dispatch({ type: LOAD_INIT })
        try {
            const { id, dashboardUiConfig } = embedData
            await embedDashboard({
                id,
                supersetDomain,
                mountPoint: ref.current,
                fetchGuestToken: postSupersetGuestToken,
                dashboardUiConfig,
            })
            dispatch({ type: LOAD_SUCCESS })
        } catch (error) {
            dispatch({ type: LOAD_ERROR, payload: error })
        }
    }, [embedData, postSupersetGuestToken, supersetDomain])

    useEffect(() => {
        if (loading || success || error) {
            return
        }
        loadEmbeddedSupersetDashboard()
    }, [loading, error, success, loadEmbeddedSupersetDashboard])

    useEffect(() => {
        dispatch({ type: LOAD_RESET })
    }, [embedData])

    return (
        <div className={styles.container}>
            <div
                ref={ref}
                className={cx(styles.iframeHost, {
                    [styles.opaque]: loading || error,
                })}
            />
            {(loading || error) && (
                <div className={styles.contentOverlay}>
                    {loading && (
                        <div className={styles.loaderContainer}>
                            <CircularLoader extrasmall />
                            <p>{i18n.t('Fetching external dashboard')}</p>
                        </div>
                    )}
                    {error && (
                        <NoticeBox error title={i18n.t('Error')}>
                            <p className={styles.errorText}>
                                {i18n.t('Could not load superset dashboard')}
                            </p>
                            <Button
                                secondary
                                small
                                onClick={() => {
                                    dispatch({ type: LOAD_RESET })
                                    loadEmbeddedSupersetDashboard()
                                }}
                            >
                                {i18n.t('Retry')}
                            </Button>
                        </NoticeBox>
                    )}
                </div>
            )}
        </div>
    )
}
