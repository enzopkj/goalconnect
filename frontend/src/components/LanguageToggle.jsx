import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            className="language-toggle"
            onClick={toggleLanguage}
        >
            {language === 'en' ? 'JP' : 'EN'}
        </button>
    );
};

export default LanguageToggle;
