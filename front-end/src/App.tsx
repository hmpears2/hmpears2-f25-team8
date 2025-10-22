import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderSignUp from './pages/ProviderSignup';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerSignUp from './pages/CustomerSignup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/provider-signup" element={<ProviderSignUp />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/customer-signup" element={<CustomerSignUp />} />
      </Routes>
    </Router>
  );
}

export default App;