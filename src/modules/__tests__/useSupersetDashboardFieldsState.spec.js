import {
    createInitialState,
    defaultInitialValues,
    FIELD_CHANGE,
    FIELD_NAME_CODE,
    FIELD_NAME_DESCRIPTION,
    FIELD_NAME_EXPAND_FILTERS,
    FIELD_NAME_SHOW_CHART_CONTROLS,
    FIELD_NAME_SUPERSET_EMBED_ID,
    FIELD_NAME_TITLE,
    isValidUuid,
    reducer,
    RESET_FIELD_STATE,
    SUPERSET_FIELD_BLUR,
} from '../useSupersetDashboardFieldsState.js'

const INITIAL_TITLE = 'Initial title'
const UPDATED_TITLE = 'Updated title'
const UUID_V1 = 'dbb4cd86-e206-11ef-9cd2-0242ac120002'
const UUID_V4 = '0394041b-8367-4fe2-9777-fe54b6d2da2f'
const UUID_V7 = '0194cae2-92f9-7363-ab58-9a19b13084eb'
const NILL_UUID = '00000000-0000-0000-0000-000000000000'

describe('superset embedded fields state reducer', () => {
    describe('UUID validator', () => {
        it('accepts valid UUID strings for common versions', () => {
            expect(isValidUuid(UUID_V1)).toBe(true)
            expect(isValidUuid(UUID_V4)).toBe(true)
            expect(isValidUuid(UUID_V7)).toBe(true)
        })
        it('rejects empty string, invalid string and nill UUID', () => {
            expect(isValidUuid(NILL_UUID)).toBe(false)
            expect(isValidUuid('')).toBe(false)
            expect(isValidUuid('a random string')).toBe(false)
        })
    })
    describe('initial state creation', () => {
        it('creates the expected initial state when not providing initial values', () => {
            expect(createInitialState()).toEqual({
                initialValues: defaultInitialValues,
                values: defaultInitialValues,
                isSupersetEmbedIdValid: false,
                isCodeValid: true,
                shouldShowSupersetEmbedIdError: false,
                hasFieldChanges: false,
            })
        })
        it('creates the expected initial state from provided initial values', () => {
            const initialValues = {
                title: 'My title',
                code: 'MY_CODE',
                description: 'My description',
                supersetEmbedId: '',
                showChartControls: false,
                expandFilters: true,
            }
            expect(createInitialState(initialValues)).toEqual({
                initialValues: initialValues,
                values: initialValues,
                isSupersetEmbedIdValid: false,
                isCodeValid: true,
                shouldShowSupersetEmbedIdError: false,
                hasFieldChanges: false,
            })
        })
        it('the initial state reports a valid superset embed ID if a valid UUID was provided', () => {
            const initialValues = {
                ...defaultInitialValues,
                supersetEmbedId: UUID_V4,
            }
            expect(createInitialState(initialValues)).toEqual({
                initialValues: initialValues,
                values: initialValues,
                isSupersetEmbedIdValid: true,
                isCodeValid: true,
                shouldShowSupersetEmbedIdError: false,
                hasFieldChanges: false,
            })
        })
        it('the intial state reports that the superset embed ID error should be displayed if invalid UUID is provided', () => {
            const initialValues = {
                ...defaultInitialValues,
                supersetEmbedId: 'a-bad-value',
            }
            expect(createInitialState(initialValues)).toEqual({
                initialValues: initialValues,
                values: initialValues,
                isSupersetEmbedIdValid: false,
                isCodeValid: true,
                shouldShowSupersetEmbedIdError: true,
                hasFieldChanges: false,
            })
        })
    })
    describe('state updates due to field change action', () => {
        it('updates state for text fields', () => {
            const initialState = createInitialState()
            const expectedState = {
                ...initialState,
                values: {
                    ...initialState.values,
                    title: UPDATED_TITLE,
                },
                hasFieldChanges: true,
            }
            expect(
                reducer(initialState, {
                    type: FIELD_CHANGE,
                    payload: { name: FIELD_NAME_TITLE, value: UPDATED_TITLE },
                })
            ).toEqual(expectedState)
        })
        it('updates state for boolean fields', () => {
            const initialState = createInitialState()
            const expectedState = {
                ...initialState,
                values: {
                    ...initialState.values,
                    showChartControls: false,
                },
                hasFieldChanges: true,
            }
            expect(
                reducer(initialState, {
                    type: FIELD_CHANGE,
                    payload: {
                        name: FIELD_NAME_SHOW_CHART_CONTROLS,
                        checked: false,
                    },
                })
            ).toEqual(expectedState)
        })
        it('detects when an code field is invalid', () => {
            const invalidCode =
                '0123456789-0123456789-0123456789-0123456789-0123456789-'
            const initialState = createInitialState()
            const expectedState = {
                ...initialState,
                values: {
                    ...initialState.values,
                    code: invalidCode,
                },
                hasFieldChanges: true,
                isCodeValid: false,
            }
            expect(
                reducer(initialState, {
                    type: FIELD_CHANGE,
                    payload: {
                        name: FIELD_NAME_CODE,
                        value: invalidCode,
                    },
                })
            ).toEqual(expectedState)
        })
        it('reports no field changes if values are changed back to initial values', () => {
            const initialState = createInitialState({
                ...defaultInitialValues,
                title: INITIAL_TITLE,
            })
            const stateAfterTitleChange = reducer(initialState, {
                type: FIELD_CHANGE,
                payload: { name: FIELD_NAME_TITLE, value: UPDATED_TITLE },
            })

            expect(stateAfterTitleChange.values.title).toBe(UPDATED_TITLE)
            expect(stateAfterTitleChange.hasFieldChanges).toBe(true)

            const stateAfterTitleReset = reducer(stateAfterTitleChange, {
                type: FIELD_CHANGE,
                payload: { name: FIELD_NAME_TITLE, value: INITIAL_TITLE },
            })

            expect(stateAfterTitleReset.values.title).toBe(INITIAL_TITLE)
            expect(stateAfterTitleReset.hasFieldChanges).toBe(false)
        })
        it('reports superset embed ID is valid if the field is changed to a valid value', () => {
            const stateAfterEmbedIdChange = reducer(createInitialState(), {
                type: FIELD_CHANGE,
                payload: { name: FIELD_NAME_SUPERSET_EMBED_ID, value: UUID_V1 },
            })

            expect(stateAfterEmbedIdChange.values.supersetEmbedId).toBe(UUID_V1)
            expect(stateAfterEmbedIdChange.isSupersetEmbedIdValid).toBe(true)
        })
    })
    describe('state updates due to superset field blur action', () => {
        it('sets superset embed ID field touched to true', () => {
            const initialState = createInitialState()
            expect(
                reducer(initialState, { type: SUPERSET_FIELD_BLUR })
            ).toEqual({ ...initialState, shouldShowSupersetEmbedIdError: true })
        })
    })
    describe('state updates due to reset field state action', () => {
        it('resets the state using the initial values in the payload', () => {
            let state = createInitialState()
            // Make various state changes
            state = reducer(state, { type: SUPERSET_FIELD_BLUR })
            state = reducer(state, {
                type: FIELD_CHANGE,
                payload: { name: FIELD_NAME_TITLE, value: INITIAL_TITLE },
            })
            state = reducer(state, {
                type: FIELD_CHANGE,
                payload: { name: FIELD_NAME_SUPERSET_EMBED_ID, value: UUID_V1 },
            })
            expect(state.values.title).toBe(INITIAL_TITLE)
            expect(state.values.supersetEmbedId).toBe(UUID_V1)
            expect(state.shouldShowSupersetEmbedIdError).toBe(false)
            expect(state.isSupersetEmbedIdValid).toBe(true)
            expect(state.hasFieldChanges).toBe(true)

            // Dispatch reset action
            const newValues = {
                [FIELD_NAME_TITLE]: UPDATED_TITLE,
                [FIELD_NAME_CODE]: 'SOME_CODE',
                [FIELD_NAME_DESCRIPTION]: 'A description text',
                [FIELD_NAME_SUPERSET_EMBED_ID]: NILL_UUID,
                [FIELD_NAME_SHOW_CHART_CONTROLS]: false,
                [FIELD_NAME_EXPAND_FILTERS]: true,
            }
            state = reducer(state, {
                type: RESET_FIELD_STATE,
                payload: newValues,
            })

            expect(state.initialValues).toEqual(newValues)
            expect(state.values).toEqual(newValues)
            expect(state.isSupersetEmbedIdValid).toBe(false)
            expect(state.shouldShowSupersetEmbedIdError).toBe(true)
            // Note that this is by design, the initalValues are also reset
            expect(state.hasFieldChanges).toBe(false)
        })
    })
})
