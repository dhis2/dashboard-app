import {
    MAP,
    EVENT_VISUALIZATION,
    VISUALIZATION,
} from '../modules/itemTypes.js'

export const ADD_IFRAME_PLUGIN_STATUS = 'ADD_IFRAME_PLUGIN_STATUS'

export const INSTALLATION_STATUS_READY = 'READY'
export const INSTALLATION_STATUS_INSTALLING = 'INSTALLING'
export const INSTALLATION_STATUS_UNKNOWN = 'UNKNOWN'
export const INSTALLATION_STATUS_WILL_NOT_INSTALL = null

export const DEFAULT_STATE_IFRAME_PLUGIN_STATUS = {
    [MAP]: INSTALLATION_STATUS_UNKNOWN,
    [EVENT_VISUALIZATION]: INSTALLATION_STATUS_UNKNOWN,
    [VISUALIZATION]: INSTALLATION_STATUS_UNKNOWN,
}

export default (
    state = DEFAULT_STATE_IFRAME_PLUGIN_STATUS,
    { type, value }
) => {
    switch (type) {
        case ADD_IFRAME_PLUGIN_STATUS: {
            return {
                ...state,
                [value.pluginType]: value.status,
            }
        }
        default:
            return state
    }
}

// selectors

export const sGetIframePluginStatus = (state) => state.iframePluginStatus
