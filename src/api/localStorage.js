export const getPreferredDashboard = username =>
    localStorage.getItem(`dhis2.dashboard.current.${username}`) || undefined;

export const storePreferredDashboard = (username, dashboardId) => {
    localStorage.setItem(`dhis2.dashboard.current.${username}`, dashboardId);
};

export const deletePreferredDashboard = username => {
    localStorage.setItem(`dhis2.dashboard.current.${username}`, null);
};
