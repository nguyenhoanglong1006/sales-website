

export enum VIEWPORT {
    MOBILE = 425,
    DESKTOP = 1024,
}

export const defineLocaleDatepicker = (defineFn: Function, vi: { abbr?: string }, en: { abbr?: string }) => {

    const code = localStorage.getItem('languageCode');

    const locale = code === 'vn' ? vi : en;

    defineFn(locale.abbr, locale);

    return locale.abbr;
}
