import {
    apiGetUserDataStoreValue,
    apiPostUserDataStoreValue,
} from './userDataStore'
import { DEFAULT_STATE_CONTROLBAR_ROWS } from '../reducers/controlBar'

const KEY_CONTROLBAR_ROWS = 'controlBarRows'

export const apiGetControlBarRows = async () =>
    await apiGetUserDataStoreValue(
        KEY_CONTROLBAR_ROWS,
        DEFAULT_STATE_CONTROLBAR_ROWS
    )

export const apiPostControlBarRows = async value =>
    await apiPostUserDataStoreValue(KEY_CONTROLBAR_ROWS, value)
