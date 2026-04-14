import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, RoleRoute } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CandidateDashboard from './pages/candidate/dashboard';
import BrowseJobs from './pages/candidate/BrowseJobs';
import MyReferrals from './pages/candidate/MyReferrals';
import ProfileSetup from './pages/candidate/ProfileSetup';
import Interviews from './pages/candidate/Interviews';
import Documents from './pages/candidate/Documents';
import EngineerDashboard from './pages/engineer/Dashboard';
import CandidateList from './pages/engineer/CandidateList';
import Earnings from './pages/engineer/Earnings';
import CompanyDashboard from './pages/company/Dashboard';
import PostJob from './pages/company/PostJob';

function RootRedirect() {
  const { isAuthenticated, getDashboardPath, loading } = useAuth();
  if (loading) return <Landing />;
  return isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : <Landing />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/candidate/dashboard" element={<RoleRoute roles={['candidate']}><CandidateDashboard /></RoleRoute>} />
      <Route path="/candidate/jobs" element={<RoleRoute roles={['candidate']}><BrowseJobs /></RoleRoute>} />
      <Route path="/candidate/referrals" element={<RoleRoute roles={['candidate']}><MyReferrals /></RoleRoute>} />
      <Route path="/candidate/profile-setup" element={<RoleRoute roles={['candidate']}><ProfileSetup /></RoleRoute>} />
      <Route path="/candidate/interviews" element={<RoleRoute roles={['candidate']}><Interviews /></RoleRoute>} />
      <Route path="/candidate/documents" element={<RoleRoute roles={['candidate']}><Documents /></RoleRoute>} />
      <Route path="/engineer/dashboard" element={<RoleRoute roles={['engineer']}><EngineerDashboard /></RoleRoute>} />
      <Route path="/engineer/candidates" element={<RoleRoute roles={['engineer']}><CandidateList /></RoleRoute>} />
      <Route path="/engineer/earnings" element={<RoleRoute roles={['engineer']}><Earnings /></RoleRoute>} />
      <Route path="/company/dashboard" element={<RoleRoute roles={['company']}><CompanyDashboard /></RoleRoute>} />
      <Route path="/company/post-job" element={<RoleRoute roles={['company']}><PostJob /></RoleRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
