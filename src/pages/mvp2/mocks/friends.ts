import type { Friend } from '../types/friend';

export const mockFriends: Friend[] = [
  {
    id: 'subin',
    name: '수빈',
    avatar: '👩🏻‍🚀',
    cityCode: 'TAIPEI',
    countryName: '대만',
    cityName: '타이베이',
    offsetFromSeoul: -1,
    lastRecordedAtLabel: '마지막 기록 어제',
  },
  {
    id: 'minji',
    name: '민지',
    avatar: '🧑🏻‍🚀',
    cityCode: 'BANGKOK',
    countryName: '태국',
    cityName: '방콕',
    offsetFromSeoul: -2,
    lastRecordedAtLabel: '마지막 기록 오늘 08:20',
  },
];

export const mockCompanionSearchResult: Friend = {
  id: 'minju',
  name: '민주',
  avatar: '🧑🏻‍🚀',
  cityCode: 'BANGKOK',
  countryName: '태국',
  cityName: '방콕',
  offsetFromSeoul: -2,
  lastRecordedAtLabel: '마지막 기록 없음',
};
