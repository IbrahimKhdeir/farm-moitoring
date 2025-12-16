import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, toggleLanguage, language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: "/", label: "Dashboard", icon: "🏠" },
    { to: "/devices", label: "Devices", icon: "📱" },
    // { to: "/sensors", label: "Sensors", icon: "📊" },
    { to: "/alerts", label: "Alerts", icon: "🔔" },
    { to: "/alert-settings", label: "Settings", icon: "⚙️" },
    // { to: "/api-keys", label: "API Keys", icon: "🔑" },
  ];

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Main Header Row */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
              {t("dashboardTitle").replace("🌾 ", "")}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {user && navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-white text-gray-900 shadow-md" 
                      : "text-gray-200 hover:bg-gray-700 hover:text-white"
                  }`
                }
              >
                <span className="hidden xl:inline">{link.icon}</span> {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-2 sm:px-3 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium"
              title={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
            >
              {language === "ar" ? "EN" : "عر"}
            </button>

            {/* User Info - Desktop */}
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <div className="text-right">
                  <p className="text-xs text-gray-400">{t("welcome")}</p>
                  <p className="text-sm font-semibold truncate max-w-[120px]">
                    {user.username || user.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  {t("logout")}
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-700 py-3">
            <nav className="grid grid-cols-3 gap-2">
              {user && navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      isActive 
                        ? "bg-white text-gray-900" 
                        : "text-gray-200 hover:bg-gray-700"
                    }`
                  }
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </nav>
            
            {/* Mobile User Actions */}
            {user && (
              <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-400">{t("welcome")}, </span>
                  <span className="font-semibold">{user.username || user.email}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium"
                >
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
