import {
    apiGetUserDataStoreValue,
    apiPostUserDataStoreValue,
} from './userDataStore'
import { DEFAULT_STATE_SHOW_DESCRIPTION } from '../reducers/showDescription'

const KEY_SHOW_DESCRIPTION = 'showDescription'

export const apiGetShowDescription = async () =>
    await apiGetUserDataStoreValue(
        KEY_SHOW_DESCRIPTION,
        DEFAULT_STATE_SHOW_DESCRIPTION
    )

export const apiPostShowDescription = value =>
    apiPostUserDataStoreValue(KEY_SHOW_DESCRIPTION, value)
