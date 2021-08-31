import arrayClean from 'd2-utilizr/lib/arrayClean'
import { isViewMode } from '../modules/dashboardModes'
import { getCustomDashboards } from '../modules/getCustomDashboards'
import { withShape } from '../modules/gridUtil'
import {
    getIdNameFields,
    getListItemFields,
    getFavoritesFields,
} from './metadata'

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
    'layout',
    'itemConfig',
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
            'favorite',
            'favorites',
            'lastUpdated',
            'href', // needed for d2-ui-translations-dialog
        ]),
    },
}

// Get more info about selected dashboard
export const apiFetchDashboard = async (
    dataEngine,
    id,
    { mode = null, forSave = false } = {}
) => {
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

        const dashboard = dashboardData.dashboard

        if (!forSave) {
            return getCustomDashboards(
                Object.assign({}, dashboard, {
                    dashboardItems: withShape(dashboard.dashboardItems),
                })
            )[0]
        }
        return dashboard
    } catch (error) {
        console.log('Error: ', error)
    }
}
