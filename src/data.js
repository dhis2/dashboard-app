const data = [{
    "id": "nghVC4wtyzi",
    "name": "Antenatal Care",
    "dashboardItems": [
        {"id": "fzgIcU3hVFH","type": "REPORTTABLE","x": 0,"y": 0,"width": 22,"height": 25},
        {"id": "DkPKc1EUmC2","type": "CHART", "x": 22, "y": 0, "width": 22, "height": 8},
        {"id": "hewtA7a025J","type": "CHART","x": 22,"y": 4,"width": 22,"height": 8},
        {"id": "hrDweynvx7G","type": "REPORTTABLE","x": 22,"y": 8,"width": 22,"height": 8}
    ]
}, {
    "id": "JW7RlN5xafN",
    "name": "Cases Malaria",
    "dashboardItems": [
        {"id": "DkPKc1EUmC2","type": "CHART","x": 0,"y": 0,"width": 20,"height": 15},
        {"id": "fzgIcU3hVFH","type": "REPORTTABLE","x": 20,"y": 0,"width": 20,"height": 5},
        {"id": "hrDweynvx7G","type": "REPORTTABLE","x": 20,"y": 4,"width": 20,"height": 5},
        {"id": "hewtA7a025J","type": "CHART","x": 20,"y": 8,"width": 20,"height": 5}
    ]
}, {
    "id": "iMnYyBfSxmM",
    "name": "Delivery",
    "dashboardItems": [
        {"id": "hewtA7a025J","type": "CHART","x": 0,"y": 0,"width": 20,"height": 15},
        {"id": "hrDweynvx7G","type": "REPORTTABLE","x": 20,"y": 0,"width": 20,"height": 5},
        {"id": "fzgIcU3hVFH","type": "REPORTTABLE","x": 20,"y": 4,"width": 20,"height": 5},
        {"id": "DkPKc1EUmC2","type": "CHART","x": 20,"y": 8,"width": 20,"height": 5}
    ]
}];

export const getDashboards = () => data.map(d => ({id: d.id, name: d.name}));

export const getDashboardItems = id => data.filter(d => d.id === id).map(d => d.dashboardItems)[0];