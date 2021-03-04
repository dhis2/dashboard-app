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

const baseDashboardFields = arrayClean([
    'id',
    'displayName',
    'displayDescription',
    'favorite~rename(starred)',
    'access',
    'restrictFilters',
    'allowedFilters',
    `dashboardItems[${getDashboardItemsFields().join(',')}]`,
])

export const viewDashboardQuery = {
    resource: 'dashboards',
    id: ({ id }) => id,
    params: {
        fields: baseDashboardFields,
    },
}

export const editDashboardQuery = {
    resource: 'dashboards',
    id: ({ id }) => id,
    params: {
        fields: arrayClean([
            ...baseDashboardFields,
            `user[${getIdNameFields({ rename: true }).join(',')}]`,
            'name',
            'description',
            'created',
            'lastUpdated',
            'href', // needed for d2-ui-translations-dialog
        ]),
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
