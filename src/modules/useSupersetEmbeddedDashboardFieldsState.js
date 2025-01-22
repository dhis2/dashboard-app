import { useCallback, useReducer } from 'react'

export const fieldNames = {
    title: 'title',
    code: 'code',
    description: 'description',
    supersetEmbedId: 'supersetEmbedId',
    showChartControls: 'showChartControls',
    showFilters: 'showFilters',
}
const defaultInitialValues = {
    [fieldNames.title]: '',
    [fieldNames.code]: '',
    [fieldNames.description]: '',
    [fieldNames.supersetEmbedId]: '',
    [fieldNames.showChartControls]: true,
    [fieldNames.showFilters]: true,
}
const FIELD_CHANGE = 'FIELD_CHANGE'
const SUPERSET_FIELD_BLUR = 'SUPERSET_FIELD_BLUR'
const RESET_FIELD_STATE = 'RESET_FIELD_STATE'
// TODO: ensure the reducer unit tests assert the correctness of the UUID validation
const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const isValidUuid = (string) => UUID_PATTERN.test(string)
const createInitialState = (initialValues) => ({
    initialValues,
    values: initialValues,
    isSupersetEmbedIdValid: isValidUuid(initialValues.supersetEmbedId),
    isSupersetEmbedIdFieldTouched: false,
    hasFieldChanges: false,
})

const reducer = (state, { type, payload }) => {
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
                    payload.name === fieldNames.supersetEmbedId
                        ? UUID_PATTERN.test(payload.value)
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
    const resetStateWithNewValues = useCallback((payload) => {
        dispatch({ type: RESET_FIELD_STATE, payload })
    }, [])

    return {
        ...state,
        onChange,
        onSupersetEmbedIdFieldBlur: state.isSupersetEmbedIdFieldTouched
            ? undefined
            : onSupersetEmbedIdFieldBlur,
        resetStateWithNewValues,
    }
}
