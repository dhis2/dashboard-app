import { useDataMutation, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { tFetchDashboards } from '../actions/dashboards.js'
import {
    acClearSelected,
    tSetSelectedDashboardById,
} from '../actions/selected.js'
import { parseSupersetEmbeddedDashboardFieldValues } from '../modules/parseSupersetEmbeddedDashboardFieldValues.js'
import { sGetSelectedId } from '../reducers/selected.js'

const getDashboardQuery = {
    dashboard: {
        resource: 'dashboards',
        id: ({ id }) => id,
        params: {
            fields: ['name', 'code', 'description', 'access', 'embedded[*]'],
        },
    },
}
const updateDashboardQuery = {
    resource: 'dashboards',
    type: 'update',
    id: ({ id }) => id,
    data: ({ values }) => parseSupersetEmbeddedDashboardFieldValues(values),
    params: {
        skipTranslation: true,
        skipSharing: true,
    },
}
const deleteDashboardQuery = {
    resource: 'dashboards',
    type: 'delete',
    id: ({ id }) => id,
}

const parseErrorText = (error) =>
    error?.details?.response?.errorReports[0]?.message ??
    i18n.t('An unknown error occurred')

export const useSupersetEmbeddedDashboardMutation = ({ closeModal }) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const id = useSelector(sGetSelectedId)
    const {
        loading: queryLoading,
        error: queryError,
        data: queryData,
    } = useDataQuery(getDashboardQuery, { variables: { id } })
    const dashboard = queryData?.dashboard
    const name = dashboard?.name
    const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] =
        useState(false)
    const [mutationLoading, setMutationLoading] = useState(false)
    const handeMutationError = useCallback(() => setMutationLoading(false), [])
    const [updateDashboard, { error: updateError }] = useDataMutation(
        updateDashboardQuery,
        { variables: { id }, onError: handeMutationError }
    )
    const [deleteDashboard, { error: deleteError }] = useDataMutation(
        deleteDashboardQuery,
        { variables: { id }, onError: handeMutationError }
    )
    const mutationError = updateError || deleteError
    const mutationErrorTitle = updateError
        ? i18n.t('Could not update dashboard {{name}}', { name })
        : i18n.t('Could not delete dashboard {{name}}', { name })
    const mutationErrorText = parseErrorText(mutationError)
    const handleUpdate = useCallback(
        async (values) => {
            setMutationLoading(true)
            await updateDashboard({ values })
            await dispatch(tSetSelectedDashboardById(id))
            setMutationLoading(false)
            closeModal()
        },
        [updateDashboard, closeModal, dispatch, id]
    )
    const handleDelete = useCallback(async () => {
        setMutationLoading(true)
        await deleteDashboard()
        dispatch(acClearSelected())
        await dispatch(tFetchDashboards())
        setMutationLoading(false)
        setShowDeleteConfirmDialog(false)
        closeModal()
        history.push('/')
    }, [deleteDashboard, closeModal, dispatch, history])

    return {
        queryLoading,
        queryHasError: !!queryError,
        queryErrorTitle: i18n.t('Could not load dashboard details'),
        queryErrorMessage: parseErrorText(queryError),
        mutationLoading,
        mutationHasError: !!mutationError,
        mutationErrorTitle,
        mutationErrorText,
        dashboard,
        showDeleteConfirmDialog,
        setShowDeleteConfirmDialog,
        handleUpdate,
        handleDelete,
    }
}
