import { useState } from 'react';
import { CompanionSearchSheet } from './components/CompanionSearchSheet';
import { FriendSheet } from './components/FriendSheet';
import { HomeScreen } from './components/HomeScreen';
import { mockCompanionSearchResult, mockFriends } from './mocks/friends';
import type { Friend } from './types/friend';

type SheetMode = 'friends' | 'search' | 'hidden';

export const Mvp2Page = () => {
  const [sheetMode, setSheetMode] = useState<SheetMode>('friends');
  const [friends, setFriends] = useState<Friend[]>(mockFriends);

  const handleOpenFriends = () => {
    setSheetMode('friends');
  };

  const handleOpenInvite = () => {
    setSheetMode('search');
  };

  const handleCloseSheet = () => {
    setSheetMode('hidden');
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

  const handleDeleteFriend = (friendId: string) => {
    setFriends((currentFriends) =>
      currentFriends.filter((friend) => friend.id !== friendId),
    );
  };

  return (
    <HomeScreen onOpenFriends={handleOpenFriends}>
      {sheetMode === 'friends' && (
        <FriendSheet
          friends={friends}
          onClose={handleCloseSheet}
          onDeleteFriend={handleDeleteFriend}
          onInvite={handleOpenInvite}
        />
      )}
      {sheetMode === 'search' && (
        <CompanionSearchSheet
          result={mockCompanionSearchResult}
          onAddCompanion={handleAddCompanion}
          onClose={handleCloseSheet}
        />
      )}
    </HomeScreen>
  );
};
