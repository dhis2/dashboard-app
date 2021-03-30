export const getFormattedDate = (value, uiLocale) => {
    if (typeof global.Intl !== 'undefined' && Intl.DateTimeFormat) {
        const locale = uiLocale || 'en'
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(value))
    }

    return value.substr(0, 19).replace('T', ' ')
}
