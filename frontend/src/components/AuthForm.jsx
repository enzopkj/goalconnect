import { useState } from 'react';
import { login, register } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const AuthForm = () => {
    const { t } = useLanguage();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', dob: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({ email: '', password: '', dob: '', confirmPassword: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSocialLogin = (provider) => {
        setIsLoading(true);
        // Redirect to backend OAuth endpoint
        window.location.href = `http://localhost:3000/api/auth/${provider.toLowerCase()}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Empty Check
        if (!formData.email || !formData.password) {
            setError(t('fillFields'));
            return;
        }

        // Additional Validation for Sign Up
        if (!isLogin) {
            if (!formData.dob) {
                setError(t('fillFields'));
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError(t('passMismatch'));
                return;
            }
        }

        setIsLoading(true);
        // Simulate network delay for effect
        await new Promise(resolve => setTimeout(resolve, 800));

        // API Call
        let result;
        if (isLogin) {
            result = await login(formData.email, formData.password);
        } else {
            // Pass DOB to register
            result = await register(formData.email, formData.password, formData.dob);
        }

        if (result.success) {
            alert(isLogin ? t('loginSuccess') : t('regSuccess'));
            // In a real app we might redirect or store token here
        } else {
            // Mask backend errors with localized message for consistency
            setError(t('loginFailed'));
        }
        setIsLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-header">
                <h1>{isLogin ? t('welcomeBack') : t('createAccount')}</h1>
                <p>{isLogin ? t('enterDetailsSignIn') : t('joinUs')}</p>
            </div>

            <div className="toggle-container">
                <button
                    className={`toggle-btn ${isLogin ? 'active' : ''}`}
                    onClick={() => !isLogin && toggleMode()}
                >
                    {t('login')}
                </button>
                <button
                    className={`toggle-btn ${!isLogin ? 'active' : ''}`}
                    onClick={() => isLogin && toggleMode()}
                >
                    {t('signUp')}
                </button>
                <div className={`toggle-slider ${!isLogin ? 'right' : ''}`} />
            </div>

            <form onSubmit={handleSubmit} className="form-content" key={isLogin ? 'login' : 'signup'}>
                {error && <div className="error-msg">{error}</div>}

                <div className="form-group">
                    <label className="form-label">{t('emailAddr')}</label>
                    <div className="form-input-wrapper">
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder={t('emailPlaceholder')}
                            value={formData.email}
                            onChange={handleChange}
                            onInvalid={(e) => {
                                if (e.target.validity.valueMissing) {
                                    e.target.setCustomValidity(t('requiredField'));
                                } else if (e.target.validity.typeMismatch) {
                                    e.target.setCustomValidity(t('invalidEmailFormat'));
                                }
                            }}
                            onInput={(e) => e.target.setCustomValidity('')}
                            required
                        />
                    </div>
                </div>

                {!isLogin && (
                    <div className="form-group">
                        <label className="form-label">{t('dob')}</label>
                        <div className="form-input-wrapper">
                            <input
                                type="date"
                                name="dob"
                                className="form-input"
                                value={formData.dob}
                                onChange={handleChange}
                                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                required
                            />
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <label className="form-label">{t('password')}</label>
                    <div className="form-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="form-input"
                            placeholder={t('passPlaceholder')}
                            value={formData.password}
                            onChange={handleChange}
                            onInvalid={(e) => e.target.setCustomValidity(t('requiredField'))}
                            onInput={(e) => e.target.setCustomValidity('')}
                            required
                        />
                        <button
                            type="button"
                            className="form-icon-btn"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                </div>

                {!isLogin && (
                    <div className="form-group">
                        <label className="form-label">{t('confirmPass')}</label>
                        <div className="form-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                className="form-input"
                                placeholder={t('passPlaceholder')}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="form-icon-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>
                )}

                {isLogin && (
                    <div className="form-options">
                        <label className="checkbox-label">
                            <input type="checkbox" className="checkbox-input" />
                            {t('rememberMe')}
                        </label>
                        <button type="button" onClick={() => navigate('/forgot-password')} className="forgot-link" style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>
                            {t('forgotPass')}
                        </button>
                    </div>
                )}

                <div className="social-divider">{t('orContinueWith')}</div>

                <div className="social-login-container">
                    <button
                        type="button"
                        className="social-btn btn-google"
                        onClick={() => handleSocialLogin('Google')}
                        disabled={isLoading}
                    >
                        <svg className="social-icon" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        {t('googleLogin')}
                    </button>
                    <button
                        type="button"
                        className="social-btn btn-line"
                        onClick={() => handleSocialLogin('LINE')}
                        disabled={isLoading}
                    >
                        <svg className="social-icon" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 10.304c0-5.694-5.385-10.304-12-10.304S0 4.61 0 10.304c0 5.1 4.28 9.354 10.088 10.14l-.427 1.57s-.103.407.247.495c.348.088 1.838-1.077 3.49-2.5 5.56-.795 9.077-4.48 9.077-8.99v-1.12z" fill="#ffffff" />
                        </svg>
                        {t('lineLogin')}
                    </button>
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? t('processing') : (isLogin ? t('signIn') : t('signUp'))}
                </button>
            </form>
        </div>
    );
};

export default AuthForm;
