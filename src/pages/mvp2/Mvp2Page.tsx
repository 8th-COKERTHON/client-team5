import { useState } from 'react';
import { CompanionSearchSheet } from './components/CompanionSearchSheet';
import { FriendSheet } from './components/FriendSheet';
import { HomeScreen } from './components/HomeScreen';
import { mockCompanionSearchResult, mockFriends } from './mocks/friends';
import type { Friend } from './types/friend';

export const Mvp2Page = () => {
  const [sheetMode, setSheetMode] = useState<'friends' | 'search'>('friends');
  const [friends, setFriends] = useState<Friend[]>(mockFriends);

  const handleOpenInvite = () => {
    setSheetMode('search');
  };

  const handleAddCompanion = (friend: Friend) => {
    setFriends((currentFriends) => {
      const hasFriend = currentFriends.some(
        (currentFriend) => currentFriend.id === friend.id,
      );

      if (hasFriend) {
        return currentFriends;
      }

      return [...currentFriends, friend];
    });
    setSheetMode('friends');
  };

  return (
    <HomeScreen>
      {sheetMode === 'friends' ? (
        <FriendSheet friends={friends} onInvite={handleOpenInvite} />
      ) : (
        <CompanionSearchSheet
          result={mockCompanionSearchResult}
          onAddCompanion={handleAddCompanion}
        />
      )}
    </HomeScreen>
  );
};
