import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/try" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
