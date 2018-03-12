const userSettings = {
    keyStyle: 'vietnam/vietnam.css',
    keyDbLocale: 'ponyLang',
};

export function getStubContext() {
    return {
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
