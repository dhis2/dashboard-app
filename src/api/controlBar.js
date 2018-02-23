import { getInstance } from 'd2/lib/d2';

const NAMESPACE = 'dashboard';
const KEY = 'controlBarRows';

const url = `userDataStore/${NAMESPACE}/${KEY}`;

export const apiGetControlBarRows = async () => {
    const d2 = await getInstance();
    const hasNamespace = await d2.currentUser.dataStore.has(NAMESPACE);
    console.log('hasNamespace', hasNamespace);

    if (hasNamespace) {
        const ns = await d2.currentUser.dataStore.get(NAMESPACE);
        console.log('ns', ns);
        const hasKey = ns.keys.find(key => key === KEY);
        console.log('hasKey', hasKey);

        if (hasKey) {
            return await ns.get(KEY);
        }
    }
};

export const apiPostControlBarRows = rows =>
    getInstance().then(d2 => {
        d2.Api.getApi().update(url, rows);
    });
