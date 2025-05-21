import { useCallback, useEffect, useReducer } from 'react'

const SET_LOADING = 'SET_LOADING'
const SET_ERROR = 'SET_ERROR'
const SET_DATA = 'SET_DATA'
const initalState = {
    loading: false,
    error: undefined,
    data: undefined,
}

function reducer(state, action) {
    switch (action.type) {
        case SET_LOADING:
            return { ...initalState, loading: true }
        case SET_ERROR:
            return { ...initalState, error: action.payload }
        case SET_DATA:
            return { ...initalState, data: action.payload }
        default:
            return state
    }
}

export function useAsyncCallbackState(asyncCallback) {
    const [state, dispatch] = useReducer(reducer, initalState)
    const callAsyncCallback = useCallback(async () => {
        dispatch({ type: SET_LOADING })
        try {
            const data = await asyncCallback()
            dispatch({ type: SET_DATA, payload: data })
        } catch (error) {
            console.error(error)
            dispatch({ type: SET_ERROR, payload: error })
        }
    }, [asyncCallback, dispatch])

    useEffect(() => {
        if (!state.loading && !state.error && !state.data) {
            callAsyncCallback()
        }
    }, [state, callAsyncCallback])

    return state
}
