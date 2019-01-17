import { getInstance } from 'd2';
import { DEFAULT_STATE_CONTROLBAR_ROWS } from '../reducers/controlBar';

const NAMESPACE = 'dashboard';
const KEY = 'controlBarRows';

const hasNamespace = async d2 => await d2.currentUser.dataStore.has(NAMESPACE);

const getNamespace = async (d2, hasNamespace) =>
    hasNamespace
        ? await d2.currentUser.dataStore.get(NAMESPACE)
        : await d2.currentUser.dataStore.create(NAMESPACE);

export const apiGetControlBarRows = async () => {
    const d2 = await getInstance();
    const namespace = await getNamespace(d2, await hasNamespace(d2));
    const hasKey = namespace.keys && namespace.keys.find(key => key === KEY);

    if (hasKey) {
        return await namespace.get(KEY);
    } else {
        await apiPostControlBarRows(DEFAULT_STATE_CONTROLBAR_ROWS, namespace);
        console.log(
            '(These errors to /userDataStore/dashboard can be ignored)'
        );
        return DEFAULT_STATE_CONTROLBAR_ROWS;
    }
};

export const apiPostControlBarRows = async (rows, namespace) => {
    const d2 = await getInstance();
    const ns = namespace || (await getNamespace(d2, hasNamespace));

    ns.set(KEY, rows);
};
