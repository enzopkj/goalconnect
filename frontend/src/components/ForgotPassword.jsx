import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const ForgotPassword = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ email: '', dob: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const result = await forgotPassword(formData.email, formData.dob);

        if (result.success) {
            setMessage(result.message); // Backend success needs translation ideally, but leaving for now as per focused request on errors
        } else {
            // Mask backend errors
            setError(t('accountNotFound'));
        }
        setIsLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-header">
                <h1>{t('accountRecovery')}</h1>
                <p>{t('enterDetailsReset')}</p>
            </div>

            <form onSubmit={handleSubmit} className="form-content">
                {error && <div className="error-msg">{error}</div>}
                {message && <div style={{ color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}

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

                <div className="form-group">
                    <label className="form-label">{t('dob')}</label>
                    <div className="form-input-wrapper">
                        <input
                            type="date"
                            name="dob"
                            className="form-input"
                            value={formData.dob}
                            onChange={handleChange}
                            onInvalid={(e) => e.target.setCustomValidity(t('requiredField'))}
                            onInput={(e) => e.target.setCustomValidity('')}
                            required
                        />

                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? t('verifying') : t('sendLink')}
                </button>

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <button type="button" onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>
                        {t('backToLogin')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
