import arrayClean from 'd2-utilizr/lib/arrayClean'
import { onError } from './index'
import {
    getIdNameFields,
    getListItemFields,
    getFavoritesFields,
} from './metadata'
import { isViewMode } from '../components/Dashboard/dashboardModes'

const getDashboardItemsFields = () =>
    arrayClean([
        'id',
        'type',
        'shape',
        'x',
        'y',
        'width~rename(w)',
        'height~rename(h)',
        'messages',
        'text',
        'appKey',
        `${getListItemFields().join(',')}`,
        `${getFavoritesFields().join(',')}`,
    ])

export const viewDashboardQuery = {
    resource: 'dashboards',
    id: ({ id }) => id,
    params: {
        fields: arrayClean([
            'id',
            'displayName',
            'displayDescription',
            'favorite',
            `user[${getIdNameFields({ rename: true }).join(',')}]`,
            'access',
            'restrictFilters',
            'allowedFilters',
            `dashboardItems[${getDashboardItemsFields().join(',')}]`,
        ]).join(','),
    },
}

export const editDashboardQuery = {
    resource: 'dashboards',
    id: ({ id }) => id,
    params: {
        fields: arrayClean([
            'id',
            'name',
            'displayName',
            'description',
            'displayDescription',
            'favorite',
            `user[${getIdNameFields({ rename: true }).join(',')}]`,
            'created',
            'lastUpdated',
            'access',
            'href', // needed for d2-ui-translations-dialog
            'restrictFilters',
            'allowedFilters',
            `dashboardItems[${getDashboardItemsFields().join(',')}]`,
        ]).join(','),
    },
}

// Get more info about selected dashboard
export const apiFetchDashboard = async (dataEngine, id, mode) => {
    const query = isViewMode(mode) ? viewDashboardQuery : editDashboardQuery
    try {
        const dashboardData = await dataEngine.query(
            { dashboard: query },
            {
                variables: {
                    id,
                },
            }
        )

        return dashboardData.dashboard
    } catch (error) {
        onError(error)
    }
}
