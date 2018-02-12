export const getPreferredDashboardId = username =>
    localStorage.getItem(`dhis2.dashboard.current.${username}`) || undefined;

export const storePreferredDashboardId = (username, dashboardId) => {
    localStorage.setItem(`dhis2.dashboard.current.${username}`, dashboardId);
};
