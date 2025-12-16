import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import ForgotPassword from './components/ForgotPassword';
import ChangePassword from './components/ChangePassword';
import LanguageToggle from './components/LanguageToggle';
import { LanguageProvider } from './contexts/LanguageContext';
import './styles/theme.css';
import './styles/main.css';

function App() {
    return (
        <LanguageProvider>
            <Router>
                <div className="app-container">
                    <LanguageToggle />
                    <Routes>
                        <Route path="/" element={<AuthForm />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/change-password" element={<ChangePassword />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </LanguageProvider>
    );
}

export default App;
