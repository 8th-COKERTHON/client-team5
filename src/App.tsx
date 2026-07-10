import { HomeScreen } from './features/home/HomeScreen';
import { FriendSheet } from './features/friends/FriendSheet';
import { mockFriends } from './mocks/friends';

const App = () => {
  return (
    <HomeScreen>
      <FriendSheet friends={mockFriends} />
    </HomeScreen>
  );
};

export default App;
