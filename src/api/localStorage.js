export const getPreferredDashboard = username => {
    return (
        localStorage.getItem(`dhis2.dashboard.current.${username}`) || undefined
    );
};

export const putPreferredDashboard = (username, dashboardId) => {
    localStorage.setItem(`dhis2.dashboard.current.${username}`, dashboardId);
};
