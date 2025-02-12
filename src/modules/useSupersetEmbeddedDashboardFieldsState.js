import { useCallback, useReducer } from 'react'

export const FIELD_NAME_TITLE = 'title'
export const FIELD_NAME_CODE = 'code'
export const FIELD_NAME_DESCRIPTION = 'description'
export const FIELD_NAME_SUPERSET_EMBED_ID = 'supersetEmbedId'
export const FIELD_NAME_SHOW_CHART_CONTROLS = 'showChartControls'
export const FIELD_NAME_EXPAND_FILTERS = 'expandFilters'

export const defaultInitialValues = {
    [FIELD_NAME_TITLE]: '',
    [FIELD_NAME_CODE]: '',
    [FIELD_NAME_DESCRIPTION]: '',
    [FIELD_NAME_SUPERSET_EMBED_ID]: '',
    [FIELD_NAME_SHOW_CHART_CONTROLS]: true,
    [FIELD_NAME_EXPAND_FILTERS]: false,
}
export const FIELD_CHANGE = 'FIELD_CHANGE'
export const SUPERSET_FIELD_BLUR = 'SUPERSET_FIELD_BLUR'
export const RESET_FIELD_STATE = 'RESET_FIELD_STATE'
// Adapted from :https://github.com/uuidjs/uuid/blob/main/src/regex.ts
const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export const isValidUuid = (string) => UUID_PATTERN.test(string)
export const createInitialState = (initialValues = defaultInitialValues) => ({
    initialValues,
    values: initialValues,
    isSupersetEmbedIdValid: isValidUuid(initialValues.supersetEmbedId),
    isSupersetEmbedIdFieldTouched: false,
    hasFieldChanges: false,
})

export const reducer = (state, { type, payload }) => {
    switch (type) {
        case FIELD_CHANGE: {
            const values = {
                ...state.values,
                [payload.name]:
                    typeof payload.checked === 'boolean'
                        ? payload.checked
                        : payload.value,
            }

            return {
                ...state,
                values,
                isSupersetEmbedIdValid:
                    payload.name === FIELD_NAME_SUPERSET_EMBED_ID
                        ? isValidUuid(payload.value)
                        : state.isSupersetEmbedIdValid,
                hasFieldChanges: Object.entries(values).some(
                    ([key, value]) => value !== state.initialValues[key]
                ),
            }
        }
        case SUPERSET_FIELD_BLUR:
            return {
                ...state,
                isSupersetEmbedIdFieldTouched: true,
            }
        case RESET_FIELD_STATE:
            return createInitialState(payload)
        default:
            return state
    }
}

export const useSupersetEmbeddedDashboardFieldsState = (
    initialValues = defaultInitialValues
) => {
    const [state, dispatch] = useReducer(
        reducer,
        createInitialState(initialValues)
    )
    const onChange = useCallback((payload) => {
        dispatch({ type: FIELD_CHANGE, payload })
    }, [])
    const onSupersetEmbedIdFieldBlur = useCallback((payload) => {
        dispatch({ type: SUPERSET_FIELD_BLUR, payload })
    }, [])
    const resetFieldsStateWithNewValues = useCallback((payload) => {
        dispatch({ type: RESET_FIELD_STATE, payload })
    }, [])

    return {
        ...state,
        onChange,
        onSupersetEmbedIdFieldBlur: state.isSupersetEmbedIdFieldTouched
            ? undefined
            : onSupersetEmbedIdFieldBlur,
        resetFieldsStateWithNewValues,
    }
}
