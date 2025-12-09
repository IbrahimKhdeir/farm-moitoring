import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const LanguageContext = createContext(null);

const translations = {
  ar: {
    // Login Page
    loginTitle: 'مراقبة المزرعة',
    loginSubtitle: 'سجل الدخول للوصول إلى لوحة التحكم',
    username: 'اسم المستخدم',
    usernamePlaceholder: 'أدخل اسم المستخدم',
    password: 'كلمة المرور',
    passwordPlaceholder: 'أدخل كلمة المرور',
    signIn: 'تسجيل الدخول',
    loginError: 'الرجاء إدخال اسم المستخدم وكلمة المرور',
    invalidCredentials: 'بيانات الاعتماد غير صحيحة. يرجى المحاولة مرة أخرى.',
    
    // Header
    dashboardTitle: '🌾 لوحة مراقبة المزرعة',
    welcome: 'مرحباً',
    logout: 'تسجيل الخروج',
    
    // Dashboard
    realTimeMonitoring: 'المراقبة في الوقت الفعلي',
    liveSensorData: 'بيانات المستشعرات المباشرة من مزرعتك',
    systemStatus: 'حالة النظام',
    mqttConnected: 'MQTT متصل',
    sensorsActive: 'المستشعرات نشطة',
    dataStreaming: 'تدفق البيانات',
    
    // Climate Card
    climateMonitoring: '🌡 مراقبة المناخ',
    temperature: 'درجة الحرارة',
    humidity: 'الرطوبة',
    
    // Gas Card
    gasQuality: '🌫 جودة الغاز',
    mq135Sensor: 'مستشعر MQ135',
    status: 'الحالة',
    good: 'جيد',
    moderate: 'متوسط',
    high: 'عالٍ',
    noData: 'لا توجد بيانات',
    
    // Protected Route
    loading: 'جاري التحميل...',
    
    // Language
    switchToEnglish: 'English',
    
    // Weather
    weatherTitle: 'حالة الطقس',
    weatherError: 'فشل في تحميل بيانات الطقس',
    feelsLike: 'يشعر وكأنه',
    forecast: 'توقعات الطقس',
    today: 'اليوم',
    sunrise: 'شروق الشمس',
    sunset: 'غروب الشمس',
    
    // Registration
    registerTitle: 'إنشاء حساب جديد',
    registerSubtitle: 'سجل للوصول إلى لوحة التحكم',
    name: 'الاسم',
    namePlaceholder: 'أدخل اسمك',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'example@email.com',
    confirmPassword: 'تأكيد كلمة المرور',
    confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
    register: 'تسجيل',
    registering: 'جاري التسجيل...',
    registerSuccess: 'تم إنشاء الحساب بنجاح. يمكنك الآن تسجيل الدخول.',
    registerError: 'فشل في التسجيل. يرجى المحاولة مرة أخرى.',
    fillAllFields: 'يرجى ملء جميع الحقول',
    passwordMismatch: 'كلمات المرور غير متطابقة',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    noAccount: 'ليس لديك حساب؟',
    createAccount: 'إنشاء حساب',
  },
  en: {
    // Login Page
    loginTitle: 'Farm Monitoring',
    loginSubtitle: 'Sign in to access your dashboard',
    username: 'Username',
    usernamePlaceholder: 'Enter your username',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    signIn: 'Sign in',
    loginError: 'Please enter both username and password',
    invalidCredentials: 'Invalid credentials. Please try again.',
    
    // Header
    dashboardTitle: '🌾 Farm Monitoring Dashboard',
    welcome: 'Welcome',
    logout: 'Logout',
    
    // Dashboard
    realTimeMonitoring: 'Real-Time Monitoring',
    liveSensorData: 'Live sensor data from your farm',
    systemStatus: 'System Status',
    mqttConnected: 'MQTT Connected',
    sensorsActive: 'Sensors Active',
    dataStreaming: 'Data Streaming',
    
    // Climate Card
    climateMonitoring: '🌡 Climate Monitoring',
    temperature: 'Temperature',
    humidity: 'Humidity',
    
    // Gas Card
    gasQuality: '🌫 Gas Quality',
    mq135Sensor: 'MQ135 Sensor',
    status: 'Status',
    good: 'Good',
    moderate: 'Moderate',
    high: 'High',
    noData: 'No Data',
    
    // Protected Route
    loading: 'Loading...',
    
    // Language
    switchToEnglish: 'العربية',
    
    // Weather
    weatherTitle: 'Weather',
    weatherError: 'Failed to load weather data',
    feelsLike: 'Feels like',
    forecast: 'Forecast',
    today: 'Today',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    
    // Registration
    registerTitle: 'Create Account',
    registerSubtitle: 'Register to access your dashboard',
    name: 'Name',
    namePlaceholder: 'Enter your name',
    email: 'Email',
    emailPlaceholder: 'example@email.com',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter your password',
    register: 'Register',
    registering: 'Registering...',
    registerSuccess: 'Account created successfully. You can now log in.',
    registerError: 'Registration failed. Please try again.',
    fillAllFields: 'Please fill in all fields',
    passwordMismatch: 'Passwords do not match',
    alreadyHaveAccount: 'Already have an account?',
    noAccount: "Don't have an account?",
    createAccount: 'Create Account',
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ar'); // Arabic as default

  useEffect(() => {
    // Check if language preference is saved in cookies
    const savedLanguage = Cookies.get('language');
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    } else {
      // Set Arabic as default and save to cookie
      setLanguage('ar');
      Cookies.set('language', 'ar', { expires: 365 });
    }
  }, []);

  const changeLanguage = (lang) => {
    if (lang === 'ar' || lang === 'en') {
      setLanguage(lang);
      Cookies.set('language', lang, { expires: 365 });
      // Update document direction
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    changeLanguage(newLang);
  };

  useEffect(() => {
    // Set initial document direction and language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

