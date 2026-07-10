import { useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ApiError, getAccessToken } from '@/api/client';
import {
  addCompanion,
  deleteCompanion,
  fetchCompanions,
  searchCompanion,
  type Companion,
  type CompanionSearchResult,
} from '@/api/companions';
import { CompanionSearchSheet } from './components/CompanionSearchSheet';
import { FriendSheet } from './components/FriendSheet';
import { HomeScreen } from './components/HomeScreen';
import type { Friend } from './types/friend';

type SheetMode = 'friends' | 'search' | 'hidden';
type FriendSheetEntryMotion = 'slide' | 'settle';

const EMPTY_SLEEP_CITY_LABEL = '수면 기록 없음';
const EMPTY_JETLAG_LABEL = '수면시차 기록 없음';
const EMPTY_RECORDED_AT_LABEL = '마지막 기록 없음';

const formatRecordedAt = (recordedAt: string | null) => {
  if (!recordedAt) {
    return EMPTY_RECORDED_AT_LABEL;
  }

  const date = new Date(recordedAt);

  if (Number.isNaN(date.getTime())) {
    return EMPTY_RECORDED_AT_LABEL;
  }

  return `마지막 기록 ${date.toLocaleDateString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
  })}`;
};

const getOffsetFromMinutes = (jetlagMinutes: number | null) => {
  if (jetlagMinutes === null) {
    return 0;
  }

  return Math.trunc(jetlagMinutes / 60);
};

const getAvatar = (nickname: string) => {
  return nickname.trim().slice(0, 1) || '?';
};

const mapCompanionToFriend = (companion: Companion): Friend => {
  return {
    id: String(companion.companionMemberId),
    companionMemberId: companion.companionMemberId,
    name: companion.nickname,
    avatar: getAvatar(companion.nickname),
    profileImageUrl: companion.profileImageUrl,
    cityCode: companion.city?.airportCode ?? '-',
    countryName: companion.city?.countryName ?? '',
    cityName: companion.city?.cityNameKr ?? EMPTY_SLEEP_CITY_LABEL,
    offsetFromSeoul: getOffsetFromMinutes(companion.jetlagMinutes),
    offsetLabel: companion.jetlagLabel ?? EMPTY_JETLAG_LABEL,
    lastRecordedAtLabel: formatRecordedAt(companion.lastRecordedAt),
  };
};

const mapSearchResultToFriend = (
  companionSearchResult: CompanionSearchResult,
): Friend => {
  return {
    id: String(companionSearchResult.memberId),
    loginId: companionSearchResult.loginId,
    name: companionSearchResult.nickname,
    avatar: getAvatar(companionSearchResult.nickname),
    profileImageUrl: companionSearchResult.profileImageUrl,
    cityCode: '-',
    countryName: '',
    cityName: EMPTY_SLEEP_CITY_LABEL,
    offsetFromSeoul: 0,
    offsetLabel: EMPTY_JETLAG_LABEL,
    lastRecordedAtLabel: EMPTY_RECORDED_AT_LABEL,
    alreadyCompanion: companionSearchResult.alreadyCompanion,
  };
};

export const Mvp2Page = () => {
  const navigate = useNavigate();
  const [sheetMode, setSheetMode] = useState<SheetMode>('hidden');
  const [friendSheetEntryMotion, setFriendSheetEntryMotion] =
    useState<FriendSheetEntryMotion>('slide');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchResult, setSearchResult] = useState<Friend | null>(null);
  const [searchErrorMessage, setSearchErrorMessage] = useState('');
  const [hasNoSearchResult, setHasNoSearchResult] = useState(false);
  const [isSearching, setSearching] = useState(false);
  const [isAdding, setAdding] = useState(false);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('grantType');
    navigate('/login');
  }, [navigate]);

  const loadCompanions = useCallback(async () => {
    try {
      const companions = await fetchCompanions();
      setFriends(companions.map(mapCompanionToFriend));
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleUnauthorized();
      }
    }
  }, [handleUnauthorized]);

  const handleOpenFriends = () => {
    if (!getAccessToken()) {
      navigate('/login');
      return;
    }

    setFriendSheetEntryMotion('slide');
    setSheetMode('friends');
    void loadCompanions();
  };

  const handleOpenInvite = () => {
    setSearchResult(null);
    setSearchErrorMessage('');
    setHasNoSearchResult(false);
    setSheetMode('search');
  };

  const handleCloseSheet = () => {
    setSheetMode('hidden');
  };

  const handleSearchCompanion = async (loginId: string) => {
    setSearching(true);
    setSearchErrorMessage('');
    setHasNoSearchResult(false);
    setSearchResult(null);

    try {
      const companionSearchResult = await searchCompanion(loginId);
      setSearchResult(mapSearchResultToFriend(companionSearchResult));
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          handleUnauthorized();
          return;
        }

        if (error.status === 404) {
          setHasNoSearchResult(true);
          return;
        }

        setSearchErrorMessage(error.message);
        return;
      }

      setSearchErrorMessage('동행자를 검색하지 못했어요.');
    } finally {
      setSearching(false);
    }
  };

  const handleAddCompanion = async (friend: Friend) => {
    if (!friend.loginId || isAdding) {
      return;
    }

    setAdding(true);
    setSearchErrorMessage('');

    try {
      const companion = await addCompanion(friend.loginId);

      setFriendSheetEntryMotion('settle');
      setFriends((currentFriends) => {
        const hasFriend = currentFriends.some(
          (currentFriend) =>
            currentFriend.companionMemberId === companion.companionMemberId,
        );

        if (hasFriend) {
          return currentFriends;
        }

        return [...currentFriends, mapCompanionToFriend(companion)];
      });
      setSheetMode('friends');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          handleUnauthorized();
          return;
        }

        setSearchErrorMessage(error.message);
        return;
      }

      setSearchErrorMessage('동행자를 추가하지 못했어요.');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteFriend = async (friendId: string) => {
    const friend = friends.find((currentFriend) => currentFriend.id === friendId);

    if (!friend?.companionMemberId) {
      return;
    }

    try {
      await deleteCompanion(friend.companionMemberId);
      setFriends((currentFriends) =>
        currentFriends.filter((currentFriend) => currentFriend.id !== friendId),
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleUnauthorized();
      }
    }
  };

  return (
    <HomeScreen
      isSheetOpen={sheetMode !== 'hidden'}
      onCloseSheet={handleCloseSheet}
      onOpenFriends={handleOpenFriends}
    >
      <AnimatePresence>
        {sheetMode === 'friends' && (
          <FriendSheet
            key="friends"
            entryMotion={friendSheetEntryMotion}
            friends={friends}
            onClose={handleCloseSheet}
            onDeleteFriend={handleDeleteFriend}
            onInvite={handleOpenInvite}
          />
        )}
        {sheetMode === 'search' && (
          <CompanionSearchSheet
            key="search"
            errorMessage={searchErrorMessage}
            hasNoSearchResult={hasNoSearchResult}
            isAdding={isAdding}
            isSearching={isSearching}
            result={searchResult}
            onAddCompanion={handleAddCompanion}
            onClose={handleCloseSheet}
            onSearch={handleSearchCompanion}
          />
        )}
      </AnimatePresence>
    </HomeScreen>
  );
};
