export interface Friend {
  id: string;
  companionMemberId?: number;
  loginId?: string;
  name: string;
  avatar: string;
  profileImageUrl?: string | null;
  cityCode: string;
  countryName: string;
  cityName: string;
  offsetFromSeoul: number;
  offsetLabel?: string;
  lastRecordedAtLabel: string;
  alreadyCompanion?: boolean;
}
