import {
    apiGetUserDataStoreValue,
    apiPostUserDataStoreValue,
} from './userDataStore'
import { DEFAULT_STATE_SELECTED_SHOWDESCRIPTION } from '../reducers/selected'

const KEY_SHOW_DESCRIPTION = 'showDescription'

export const apiGetShowDescription = async () =>
    await apiGetUserDataStoreValue(
        KEY_SHOW_DESCRIPTION,
        DEFAULT_STATE_SELECTED_SHOWDESCRIPTION
    )

export const apiPostShowDescription = value =>
    apiPostUserDataStoreValue(KEY_SHOW_DESCRIPTION, value)
