export const getCurrentUnixTime = () => new Date().getTime() / 1000

export const getDateFromUnix = (timestamp: number, locale: string = 'en-GB') =>
    new Date(timestamp * 1000).toLocaleDateString(locale)

export const getTimeFromUnix = (timestamp: number, locale: string = 'en-GB') =>
    new Date(timestamp * 1000).toLocaleTimeString(locale)

export const getFullTimeFromUnix = (timestamp: number, locale: string = 'en-GB') =>
    new Date(timestamp * 1000).toLocaleDateString(locale) + ' ' +
    new Date(timestamp * 1000).toLocaleTimeString(locale)