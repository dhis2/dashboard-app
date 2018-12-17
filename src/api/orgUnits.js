import { getInstance } from 'd2';

export const apiFetchOrgUnits = () => {
    return getInstance().then(d2 => {
        return d2.models.organisationUnits
            .list({
                paging: false,
                fields: 'id,path,displayName,children::isNotEmpty',
                userDataViewFallback: true,
            })
            .then(rootLevel => {
                const rootList = rootLevel.toArray();
                const roots = rootList.length > 1 ? rootList : [rootList[0]];

                return roots;
            });
    });
};
