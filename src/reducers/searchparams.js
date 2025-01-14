import { useLocation, useHistory } from "react-router-dom";

export const searchParams = () => {
    const location = useLocation();
    const history = useHistory();

    const addSearchParamsToUrl = (key, value) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set(key, value);

        // Update the URL with new query params
        history.push({
            pathname: location.pathname,
            search: `?${searchParams.toString()}`,
        });
    };

    const removeSearchParamsFromUrlByKey = (key) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete(key);

        // Update the URL after removing the query parameter
        history.push({
            pathname: location.pathname,
            search: searchParams.toString() ? `?${searchParams.toString()}` : "",
        });
    };

    const overrideValueBasedOnKey = (key, newValues) => {
        const searchParams = new URLSearchParams(location.search);
    
        if (newValues.length > 0) {
            // Overwrite the key parameter with new values
            searchParams.set(key, newValues.join(";"));
        } else {
            // If newValues is empty, remove the key from the URL
            searchParams.delete(key);
        }
    
        // Update the URL with the overridden query parameters
        history.push({
            pathname: location.pathname,
            search: `?${searchParams.toString()}`,
        });
    };

    return {
        addSearchParamsToUrl,
        removeSearchParamsFromUrlByKey,
        overrideValueBasedOnKey
    };
};
