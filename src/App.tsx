import { useState } from 'react';
import { HomeScreen } from './features/home/HomeScreen';
import { FriendSheet } from './features/friends/FriendSheet';
import { CompanionSearchSheet } from './features/friends/CompanionSearchSheet';
import { mockCompanionSearchResult, mockFriends } from './mocks/friends';
import type { Friend } from './types/friend';

const App = () => {
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

export default App;
