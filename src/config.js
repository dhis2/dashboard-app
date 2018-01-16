export const getBaseUrl = manifest => {
    return process.env.NODE_ENV === 'production'
        ? manifest.getBaseUrl()
        : 'http://localhost:8080';
};
