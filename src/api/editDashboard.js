import { EDIT } from '../modules/dashboardModes.js'
import { apiFetchDashboard } from './fetchDashboard.js'

export const createDashboardMutation = {
    resource: 'dashboards',
    type: 'create',
    data: ({ data }) => data,
}

export const updateDashboardMutation = {
    resource: 'dashboards',
    type: 'update',
    id: ({ id }) => id,
    data: ({ data }) => data,
    params: {
        skipTranslation: true,
        skipSharing: true,
    },
}

const generatePayload = (dashboard = {}, data) => {
    return {
        ...dashboard,
        name: data.name,
        code: data.code,
        description: data.description,
        dashboardItems: data.dashboardItems.map((item) => ({
            ...item,
            width: item.w,
            height: item.h,
        })),
        allowedFilters: data.allowedFilters,
        restrictFilters: data.restrictFilters,
        layout: data.layout,
        itemConfig: data.itemConfig,
    }
}

export const updateDashboard = async (dataEngine, data) => {
    const dashboard = await apiFetchDashboard(dataEngine, data.id, {
        mode: EDIT,
        forSave: true,
    })

    const { response } = await dataEngine.mutate(updateDashboardMutation, {
        variables: {
            id: data.id,
            data: generatePayload(dashboard, data),
        },
    })

    return response.uid
}

export const postDashboard = async (dataEngine, data) => {
    const { response } = await dataEngine.mutate(createDashboardMutation, {
        variables: {
            data: generatePayload({}, data),
        },
    })

    return response.uid
}
