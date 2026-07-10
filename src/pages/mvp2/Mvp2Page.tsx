import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CompanionSearchSheet } from './components/CompanionSearchSheet';
import { FriendSheet } from './components/FriendSheet';
import { HomeScreen } from './components/HomeScreen';
import { mockCompanionSearchResult, mockFriends } from './mocks/friends';
import type { Friend } from './types/friend';

type SheetMode = 'friends' | 'search' | 'hidden';
type FriendSheetEntryMotion = 'slide' | 'settle';

export const Mvp2Page = () => {
  const [sheetMode, setSheetMode] = useState<SheetMode>('friends');
  const [friendSheetEntryMotion, setFriendSheetEntryMotion] =
    useState<FriendSheetEntryMotion>('slide');
  const [friends, setFriends] = useState<Friend[]>(mockFriends);

  const handleOpenFriends = () => {
    setFriendSheetEntryMotion('slide');
    setSheetMode('friends');
  };

  const handleOpenInvite = () => {
    setSheetMode('search');
  };

  const handleCloseSheet = () => {
    setSheetMode('hidden');
  };

  const handleAddCompanion = (friend: Friend) => {
    setFriendSheetEntryMotion('settle');
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
            result={mockCompanionSearchResult}
            onAddCompanion={handleAddCompanion}
            onClose={handleCloseSheet}
          />
        )}
      </AnimatePresence>
    </HomeScreen>
  );
};
