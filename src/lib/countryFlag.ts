const countryFlagModules = import.meta.glob<string>(
  '/src/assets/country/*.{svg,png,webp}',
  {
    eager: true,
    import: 'default',
    query: '?url',
  },
);

const normalizeCityName = (cityName: string) =>
  cityName
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase();

const COUNTRY_FLAG_BY_CITY = Object.entries(countryFlagModules).reduce<Record<string, string>>(
  (flagMap, [filePath, flagUrl]) => {
    const fileName = filePath.split('/').pop()?.replace(/\.[^.]+$/, '') ?? '';
    const cityNameSeparatorIndex = fileName.indexOf('_');

    if (cityNameSeparatorIndex === -1) return flagMap;

    const cityName = fileName.slice(cityNameSeparatorIndex + 1);
    flagMap[normalizeCityName(cityName)] = flagUrl;
    return flagMap;
  },
  {},
);

/**
 * 백엔드가 제공하는 cityNameEn을 assets/country의 국가 이미지와 연결합니다.
 * 예: "NEW DELHI" -> "India_New Delhi.svg"
 */
export const getCountryFlagByCityName = (cityNameEn: string) =>
  COUNTRY_FLAG_BY_CITY[normalizeCityName(cityNameEn)];
