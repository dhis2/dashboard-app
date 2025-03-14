import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader, NoticeBox } from '@dhis2/ui'
import { embedDashboard } from '@superset-ui/embedded-sdk'
import cx from 'classnames'
import React, { useCallback, useEffect, useReducer, useRef } from 'react'
import { useSelector } from 'react-redux'
import { usePostSupersetGuestToken } from '../../api/supersetGateway.js'
import { useSupersetBaseUrl } from '../../components/SystemSettingsProvider.js'
import {
    msGetSelectedSupersetEmbedData,
    sGetSelectedId,
} from '../../reducers/selected.js'
import styles from './styles/SupersetDashboard.module.css'

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

export const SupersetDashboard = () => {
    const [{ loading, error, success }, dispatch] = useReducer(
        reducer,
        initialLoadState
    )
    // For errors with an error code a retry will fail
    const allowRetry = error && !error.errorCode
    const ref = useRef(null)
    const selectedId = useSelector(sGetSelectedId)
    const embedData = useSelector(msGetSelectedSupersetEmbedData)
    const supersetDomain = useSupersetBaseUrl()
    const postSupersetGuestToken = usePostSupersetGuestToken(selectedId)
    const loadSupersetDashboard = useCallback(async () => {
        dispatch({ type: LOAD_INIT })
        try {
            const { id, dashboardUiConfig } = embedData
            /* We call this manually first, so that if it throws, the embedDashboard
             * function will not be called, thus avoiding briefly showing an error UI
             * in the iframe. The error has a localised message based on an error code,
             * so is informative to the user */
            await postSupersetGuestToken()
            /* This could still throw as well and still cause briefly showing the
             * error UI in the iframe, but I don't think we can do much about that */
            await embedDashboard({
                id,
                supersetDomain,
                mountPoint: ref.current,
                fetchGuestToken: postSupersetGuestToken,
                dashboardUiConfig,
            })
            dispatch({ type: LOAD_SUCCESS })
        } catch (error) {
            console.error(error)
            dispatch({ type: LOAD_ERROR, payload: error })
        }
    }, [embedData, postSupersetGuestToken, supersetDomain])

    useEffect(() => {
        if (loading || success || error) {
            return
        }
        loadSupersetDashboard()
    }, [loading, error, success, loadSupersetDashboard])

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
                                {error.message ??
                                    i18n.t('Could not load Superset dashboard')}
                            </p>
                            {allowRetry && (
                                <Button
                                    secondary
                                    small
                                    onClick={() => {
                                        dispatch({ type: LOAD_RESET })
                                        loadSupersetDashboard()
                                    }}
                                >
                                    {i18n.t('Retry')}
                                </Button>
                            )}
                        </NoticeBox>
                    )}
                </div>
            )}
        </div>
    )
}
