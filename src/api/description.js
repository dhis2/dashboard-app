import { DEFAULT_STATE_SHOW_DESCRIPTION } from '../reducers/showDescription.js'
import {
    apiGetUserDataStoreValue,
    apiPostUserDataStoreValue,
} from './userDataStore.js'

const KEY_SHOW_DESCRIPTION = 'showDescription'

export const apiGetShowDescription = async (engine) =>
    await apiGetUserDataStoreValue(
        KEY_SHOW_DESCRIPTION,
        DEFAULT_STATE_SHOW_DESCRIPTION,
        engine
    )

export const apiPostShowDescription = (value, engine) =>
    apiPostUserDataStoreValue(KEY_SHOW_DESCRIPTION, value, engine)
