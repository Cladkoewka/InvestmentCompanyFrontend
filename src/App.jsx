import './index.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import NavBar from './components/NavBar/NavBar';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import AssetsPage from './pages/AssetsPage';
import CustomersPage from './pages/CustomersPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/assets" element={<AssetsPage />} />
            <Route path="/customers" element={<CustomersPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;