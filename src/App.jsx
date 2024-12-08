import './index.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import NavBar from './components/NavBar/NavBar';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import AssetsPage from './pages/AssetsPage/AssetsPage';
import CustomersPage from './pages/CustomersPage/CustomersPage';
import DepartmentPage from './pages/DepartmentPage/DepartmentPage';
import EmployeesPage from './pages/EmployeesPage/EmployeesPage';
import RisksPage from './pages/RisksPage/RisksPage';
import EditorPage from './pages/EditorPage/EditorPage';
import ProjectsPage from './pages/ProjectsPage/ProjectsPage';
import FunctionalPage from './pages/FunctionalPage/FunctionalPage';
import Footer from './components/Footer/Footer';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={location.pathname}
        classNames="fade"
        timeout={1000}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/departments" element={<DepartmentPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/risks" element={<RisksPage />} />
          <Route path="/editors" element={<EditorPage />} />
          <Route path="/functional" element={<FunctionalPage />} />
        </Routes>
      </CSSTransition>
    </SwitchTransition>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="main-content">
          <NavBar />
          <AnimatedRoutes />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
