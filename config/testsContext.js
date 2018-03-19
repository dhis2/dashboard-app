const userSettings = {
    keyDbLocale: 'ponyLang',
};

export function getStubContext() {
    return {
        i18n: {
            t: () => {},
        },
        d2: {
            currentUser: {
                firstName: 'Mark the Ghost',
                surname: 'Polak',
                userSettings: {
                    get: key => userSettings[key],
                },
            },
        },
    };
}
