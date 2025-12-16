import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { changePassword } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const ChangePassword = () => {
    const { t } = useLanguage();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError(t('passMismatch'));
            return;
        }

        setIsLoading(true);
        const result = await changePassword(email, token, newPassword);

        if (result.success) {
            setMessage(result.message);
            // Optional: Redirect after success
            setTimeout(() => navigate('/'), 2000);
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-header">
                <h1>{t('setNewPass')}</h1>
                <p>{t('createSecurePass')}</p>
            </div>

            <form onSubmit={handleSubmit} className="form-content">
                {error && <div className="error-msg">{error}</div>}
                {message && <div style={{ color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}

                <div className="form-group">
                    <label className="form-label">{t('newPass')}</label>
                    <div className="form-input-wrapper">
                        <input
                            type="password"
                            className="form-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            onInvalid={(e) => e.target.setCustomValidity(t('requiredField'))}
                            onInput={(e) => e.target.setCustomValidity('')}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">{t('confirmPass')}</label>
                    <div className="form-input-wrapper">
                        <input
                            type="password"
                            className="form-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onInvalid={(e) => e.target.setCustomValidity(t('requiredField'))}
                            onInput={(e) => e.target.setCustomValidity('')}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? t('updating') : t('updatePass')}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
