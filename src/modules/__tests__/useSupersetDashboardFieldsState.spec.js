import { renderHook, act } from '@testing-library/react-hooks'
import {
    FIELD_NAME_CODE,
    FIELD_NAME_SHOW_CHART_CONTROLS,
    FIELD_NAME_SUPERSET_EMBED_ID,
    FIELD_NAME_TITLE,
    useSupersetDashboardFieldsState,
} from '../useSupersetDashboardFieldsState.js'

const INITIAL_TITLE = 'Initial title'
const UPDATED_TITLE = 'Updated title'
const UUID_V1 = 'dbb4cd86-e206-11ef-9cd2-0242ac120002'
const UUID_V4 = '0394041b-8367-4fe2-9777-fe54b6d2da2f'
const UUID_V7 = '0194cae2-92f9-7363-ab58-9a19b13084eb'
const NILL_UUID = '00000000-0000-0000-0000-000000000000'
const defaultInitialValues = {
    title: '',
    code: '',
    description: '',
    supersetEmbedId: '',
    showChartControls: true,
    expandFilters: false,
}

describe('useSupersetDashboardFieldsState', () => {
    describe('UUID validation', () => {
        const getIsSupersetEmbedValidState = (uuid) => {
            const { result } = renderHook(() =>
                useSupersetDashboardFieldsState({ supersetEmbedId: uuid })
            )
            return result.current.isSupersetEmbedIdValid
        }
        it('accepts valid UUID strings for common versions', () => {
            expect(getIsSupersetEmbedValidState(UUID_V1)).toBe(true)
            expect(getIsSupersetEmbedValidState(UUID_V4)).toBe(true)
            expect(getIsSupersetEmbedValidState(UUID_V7)).toBe(true)
        })
        it('rejects empty string, invalid string and nill UUID', () => {
            expect(getIsSupersetEmbedValidState(NILL_UUID)).toBe(false)
            expect(getIsSupersetEmbedValidState('')).toBe(false)
            expect(getIsSupersetEmbedValidState('a random string')).toBe(false)
        })
    })
    describe('initial state creation', () => {
        it('creates the expected initial state when not providing initial values', () => {
            const { result } = renderHook(() =>
                useSupersetDashboardFieldsState()
            )
            expect(result.current.initialValues).toEqual(defaultInitialValues)
            expect(result.current.values).toEqual(defaultInitialValues)
            expect(result.current.isSupersetEmbedIdValid).toBe(false)
            expect(result.current.isCodeValid).toBe(true)
            expect(result.current.shouldShowSupersetEmbedIdError).toBe(false)
            expect(result.current.hasFieldChanges).toBe(false)
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
            const { result } = renderHook(() =>
                useSupersetDashboardFieldsState(initialValues)
            )
            expect(result.current.initialValues).toEqual(initialValues)
            expect(result.current.values).toEqual(initialValues)
            expect(result.current.isSupersetEmbedIdValid).toBe(false)
            expect(result.current.isCodeValid).toBe(true)
            expect(result.current.shouldShowSupersetEmbedIdError).toBe(false)
            expect(result.current.hasFieldChanges).toBe(false)
        })
        it('creates the expected initial state when some properties are undefined', () => {
            const initialValues = {
                title: undefined,
                code: undefined,
                description: undefined,
                supersetEmbedId: undefined,
                showChartControls: undefined,
                expandFilters: undefined,
            }
            const { result } = renderHook(() =>
                useSupersetDashboardFieldsState(initialValues)
            )
            expect(result.current.initialValues).toEqual(defaultInitialValues)
            expect(result.current.values).toEqual(defaultInitialValues)
            expect(result.current.isSupersetEmbedIdValid).toBe(false)
            expect(result.current.isCodeValid).toBe(true)
            expect(result.current.shouldShowSupersetEmbedIdError).toBe(false)
            expect(result.current.hasFieldChanges).toBe(false)
        })
        it('the initial state reports a valid superset embed ID if a valid UUID was provided', () => {
            const initialValues = {
                ...defaultInitialValues,
                supersetEmbedId: UUID_V4,
            }
            const { result } = renderHook(() =>
                useSupersetDashboardFieldsState(initialValues)
            )
            expect(result.current.isSupersetEmbedIdValid).toBe(true)
            expect(result.current.shouldShowSupersetEmbedIdError).toBe(false)
        })
        it('the intial state reports that the superset embed ID error should be displayed if an invalid UUID is provided', () => {
            const initialValues = {
                ...defaultInitialValues,
                supersetEmbedId: 'a-bad-value',
            }
            const { result } = renderHook(() =>
                useSupersetDashboardFieldsState(initialValues)
            )
            expect(result.current.isSupersetEmbedIdValid).toBe(false)
            expect(result.current.shouldShowSupersetEmbedIdError).toBe(true)
        })
        it('the intial state reports that no superset embed ID error should be displayed if UUID is empty', () => {
            const initialValues = {
                ...defaultInitialValues,
                supersetEmbedId: '',
            }
            const { result } = renderHook(() =>
                useSupersetDashboardFieldsState(initialValues)
            )
            expect(result.current.isSupersetEmbedIdValid).toBe(false)
            expect(result.current.shouldShowSupersetEmbedIdError).toBe(false)
        })
    })
    describe('state updates due to field change action', () => {
        it('updates state for text fields', () => {
            const { result } = renderHook(() =>
                useSupersetDashboardFieldsState()
            )
            act(() => {
                result.current.onChange({
                    name: FIELD_NAME_TITLE,
                    value: UPDATED_TITLE,
                })
            })
            expect(result.current.values.title).toBe(UPDATED_TITLE)
            expect(result.current.hasFieldChanges).toBe(true)
        })
        it('updates state for boolean fields', () => {
            const { result } = renderHook(() =>
                useSupersetDashboardFieldsState()
            )
            act(() => {
                result.current.onChange({
                    name: FIELD_NAME_SHOW_CHART_CONTROLS,
                    checked: false,
                })
            })
            expect(result.current.values.showChartControls).toBe(false)
            expect(result.current.hasFieldChanges).toBe(true)
        })
        it('detects when an code field is invalid', () => {
            const invalidCode =
                '0123456789-0123456789-0123456789-0123456789-0123456789-'
            const { result } = renderHook(() =>
                useSupersetDashboardFieldsState()
            )
            act(() => {
                result.current.onChange({
                    name: FIELD_NAME_CODE,
                    value: invalidCode,
                })
            })
            expect(result.current.values.code).toBe(invalidCode)
            expect(result.current.hasFieldChanges).toBe(true)
            expect(result.current.isCodeValid).toBe(false)
        })
        it('reports no field changes if values are changed back to initial values', () => {
            const { result } = renderHook(() =>
                useSupersetDashboardFieldsState({ title: INITIAL_TITLE })
            )
            act(() => {
                result.current.onChange({
                    name: FIELD_NAME_TITLE,
                    value: UPDATED_TITLE,
                })
            })
            expect(result.current.values.title).toBe(UPDATED_TITLE)
            expect(result.current.hasFieldChanges).toBe(true)

            act(() => {
                result.current.resetFieldsStateWithNewValues({
                    title: INITIAL_TITLE,
                })
            })

            expect(result.current.values.title).toBe(INITIAL_TITLE)
            expect(result.current.hasFieldChanges).toBe(false)
        })
        it('reports superset embed ID validity state changes correctly', () => {
            const { result } = renderHook(() =>
                useSupersetDashboardFieldsState()
            )
            act(() => {
                result.current.onChange({
                    name: FIELD_NAME_SUPERSET_EMBED_ID,
                    value: UUID_V1,
                })
            })
            expect(result.current.values.supersetEmbedId).toBe(UUID_V1)
            expect(result.current.isSupersetEmbedIdValid).toBe(true)
            expect(result.current.shouldShowSupersetEmbedIdError).toBe(false)
            act(() => {
                result.current.onChange({
                    name: FIELD_NAME_SUPERSET_EMBED_ID,
                    value: NILL_UUID,
                })
            })
            expect(result.current.values.supersetEmbedId).toBe(NILL_UUID)
            expect(result.current.isSupersetEmbedIdValid).toBe(false)
            expect(result.current.shouldShowSupersetEmbedIdError).toBe(true)
            act(() => {
                result.current.onChange({
                    name: FIELD_NAME_SUPERSET_EMBED_ID,
                    value: UUID_V7,
                })
            })
            expect(result.current.values.supersetEmbedId).toBe(UUID_V7)
            expect(result.current.isSupersetEmbedIdValid).toBe(true)
            expect(result.current.shouldShowSupersetEmbedIdError).toBe(false)
        })
    })
    describe('state updates due to superset field blur action', () => {
        it('sets superset embed ID field touched to true', () => {
            const { result } = renderHook(() =>
                useSupersetDashboardFieldsState()
            )
            act(() => {
                result.current.onChange({
                    name: FIELD_NAME_SUPERSET_EMBED_ID,
                    value: NILL_UUID,
                })
            })
            // Not showing error because started empty and changed to invalid without field blur
            expect(result.current.values.supersetEmbedId).toBe(NILL_UUID)
            expect(result.current.isSupersetEmbedIdValid).toBe(false)
            expect(result.current.shouldShowSupersetEmbedIdError).toBe(false)
            // Now field blurs and error should show
            act(() => {
                result.current.onSupersetEmbedIdFieldBlur()
            })
            expect(result.current.values.supersetEmbedId).toBe(NILL_UUID)
            expect(result.current.isSupersetEmbedIdValid).toBe(false)
            expect(result.current.shouldShowSupersetEmbedIdError).toBe(true)
        })
    })
    describe('state updates due to reset field state action', () => {
        it('resets the state using the initial values in the payload', () => {
            const { result } = renderHook(() =>
                useSupersetDashboardFieldsState()
            )
            // Trigger some state changes
            act(() => {
                result.current.onChange({
                    name: FIELD_NAME_TITLE,
                    value: INITIAL_TITLE,
                })
            })
            act(() => {
                result.current.onChange({
                    name: FIELD_NAME_SUPERSET_EMBED_ID,
                    value: UUID_V1,
                })
            })

            expect(result.current.values).not.toEqual(
                result.current.initialValues
            )
            expect(result.current.hasFieldChanges).toBe(true)

            const newValues = {
                title: UPDATED_TITLE,
                code: 'SOME_CODE',
                description: 'A description text',
                supersetEmbedId: NILL_UUID,
                showChartControls: false,
                expandFilters: true,
            }

            act(() => {
                result.current.resetFieldsStateWithNewValues(newValues)
            })

            // initalValues are reset, so hasFieldChanges is false
            expect(result.current.initialValues).toEqual(newValues)
            expect(result.current.values).toEqual(result.current.initialValues)
            expect(result.current.hasFieldChanges).toBe(false)
        })
    })
})
