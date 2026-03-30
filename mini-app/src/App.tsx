import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home/Home';
import { Events } from './pages/Events/Events';
import { EventDetail } from './pages/Events/EventDetail';
import { BusinessTinder } from './pages/BusinessTinder/BusinessTinder';
import { Catalog } from './pages/Catalog/Catalog';
import { Profile } from './pages/Profile/Profile';
import { MemberProfile } from './pages/MemberProfile/MemberProfile';
import { Bonuses } from './pages/Bonuses/Bonuses';
import { EditProfile } from './pages/EditProfile/EditProfile';
import { Sreda } from './pages/Sreda/Sreda';
import { useTelegram } from './hooks/useTelegram';

function TelegramInit() {
  const { ready, expand, startParam } = useTelegram();
  const navigate = useNavigate();

  useEffect(() => {
    ready();
    expand();

    // Handle deep links from bot (e.g. startapp=event_1)
    if (startParam) {
      if (startParam.startsWith('event_')) {
        const eventId = startParam.replace('event_', '');
        navigate(`/events/${eventId}`);
      } else if (startParam === 'events') {
        navigate('/events');
      } else if (startParam === 'tinder') {
        navigate('/tinder');
      } else if (startParam === 'catalog') {
        navigate('/catalog');
      } else if (startParam === 'profile') {
        navigate('/profile');
      }
    }
  }, []);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <TelegramInit />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/tinder" element={<BusinessTinder />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/member/:id" element={<MemberProfile />} />
          <Route path="/sreda" element={<Sreda />} />
          <Route path="/bonuses" element={<Bonuses />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
