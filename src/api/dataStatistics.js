import { getInstance } from 'd2/lib/d2';

export const apiPostDataStatistics = async (eventType, id) => {
    const d2 = await getInstance();
    const url = `dataStatistics?eventType=${eventType}&favorite=${id}`;

    d2.Api.getApi().post(url);
};
