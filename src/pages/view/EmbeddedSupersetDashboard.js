import { embedDashboard } from '@superset-ui/embedded-sdk'
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
        default:
            return state
    }
}

export const EmbeddedSupersetDashboard = () => {
    const [loadingState, dispatch] = useReducer(reducer, initialLoadState)
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
        const { loading, error, success } = loadingState
        if (loading || success || error) {
            return
        }
        loadEmbeddedSupersetDashboard()
    }, [loadingState, loadEmbeddedSupersetDashboard])

    return <div ref={ref} className={styles.container} />
}
