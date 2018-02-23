import { getInstance } from 'd2/lib/d2';

export const apiPostControlBarRows = (id, isStarred) => {
    const url = `dashboards/${id}/favorite`;

    getInstance().then(d2 => {
        if (isStarred) {
            d2.Api.getApi().post(url);
        } else {
            d2.Api.getApi().delete(url);
        }
    });
};
