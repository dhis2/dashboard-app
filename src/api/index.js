import arrayClean from 'd2-utilizr/lib/arrayClean';
import { itemTypeMap } from '../modules/itemTypes';
import {
    getListItemFields,
    getFavoritesFields,
    getIdNameFields,
} from './metadata';

// Helper functions

export const onError = error => console.log('Error: ', error);

export const getEndPointName = type => itemTypeMap[type].endPointName;

// Dashboard item
export const getDashboardItemsFields = ({ withFavorite } = {}) =>
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
        withFavorite
            ? `${getFavoritesFields({
                  withDimensions: withFavorite.withDimensions,
              }).join(',')}`
            : ``,
    ]);

// Dashboard
export const getDashboardFields = ({ withItems, withFavorite } = {}) =>
    arrayClean([
        `${getIdNameFields().join(',')}`,
        'description',
        'displayDescription',
        'favorite',
        `user[${getIdNameFields({ rename: true }).join(',')}]`,
        'created',
        'lastUpdated',
        'access',
        withItems
            ? `dashboardItems[${getDashboardItemsFields({
                  withFavorite,
              }).join(',')}]`
            : ``,
    ]);
