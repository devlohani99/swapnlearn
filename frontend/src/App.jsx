import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import SkillSelection from './pages/SkillSelection';
import EditProfile from './pages/EditProfile';
import ConnectionRequests from './pages/ConnectionRequests';
import Connections from './pages/Connections';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/profile"
          element={<ProtectedRoute>
            <Profile/>
            </ProtectedRoute>}
        />
        <Route
          path="/select-skills"
          element={
            <ProtectedRoute>
              <SkillSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/connection-requests"
          element={
            <ProtectedRoute>
              <ConnectionRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/connections"
          element={
            <ProtectedRoute>
              <Connections />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;