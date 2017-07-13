const data = [{
    "id": "nghVC4wtyzi",
    "name": "Antenatal Care",
    "dashboardItems": [
        {"id": "fzgIcU3hVFH","type": "REPORTTABLE","x": 0,"y": 0,"w": 5,"h": 5},
        {"id": "DkPKc1EUmC2","type": "CHART", "x": 5, "y": 0, "w": 5, "h": 5},
        {"id": "hewtA7a025J","type": "CHART","x": 10,"y": 0,"w": 5,"h": 5},
        {"id": "hrDweynvx7G","type": "REPORTTABLE","x": 15,"y": 0,"w": 5,"h": 5}
    ]
}, {
    "id": "JW7RlN5xafN",
    "name": "Cases Malaria",
    "dashboardItems": [
        {"id": "DkPKc1EUmC2","type": "CHART","x": 0,"y": 0,"w": 20,"h": 15},
        {"id": "fzgIcU3hVFH","type": "REPORTTABLE","x": 20,"y": 0,"w": 20,"h": 5},
        {"id": "hrDweynvx7G","type": "REPORTTABLE","x": 20,"y": 4,"w": 20,"h": 5},
        {"id": "hewtA7a025J","type": "CHART","x": 20,"y": 8,"w": 20,"h": 5}
    ]
}, {
    "id": "iMnYyBfSxmM",
    "name": "Delivery",
    "dashboardItems": [
        {"id": "hewtA7a025J","type": "CHART","x": 0,"y": 0,"w": 20,"h": 15},
        {"id": "hrDweynvx7G","type": "REPORTTABLE","x": 20,"y": 0,"w": 20,"h": 5},
        {"id": "fzgIcU3hVFH","type": "REPORTTABLE","x": 20,"y": 4,"w": 20,"h": 5},
        {"id": "DkPKc1EUmC2","type": "CHART","x": 20,"y": 8,"w": 20,"h": 5}
    ]
}];

export const getDashboards = () => data.map(d => ({id: d.id, name: d.name}));

export const getDashboardItems = id => data.filter(d => d.id === id).map(d => d.dashboardItems)[0];