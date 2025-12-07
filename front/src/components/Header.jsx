import { useAuth } from "../contexts/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, toggleLanguage, language } = useLanguage();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <h1 className="text-2xl font-bold">{t("dashboardTitle")}</h1>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-4">
          {user && (
            <nav className="flex items-center gap-3 text-sm">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-1 rounded-lg ${isActive ? "bg-white text-gray-900" : "text-gray-200 hover:bg-gray-700"
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/devices"
                className={({ isActive }) =>
                  `px-3 py-1 rounded-lg ${isActive ? "bg-white text-gray-900" : "text-gray-200 hover:bg-gray-700"
                  }`
                }
              >
                Devices
              </NavLink>
              <NavLink
                to="/sensors"
                className={({ isActive }) =>
                  `px-3 py-1 rounded-lg ${isActive ? "bg-white text-gray-900" : "text-gray-200 hover:bg-gray-700"
                  }`
                }
              >
                Sensors
              </NavLink>
              <NavLink
                to="/alerts"
                className={({ isActive }) =>
                  `px-3 py-1 rounded-lg ${isActive ? "bg-white text-gray-900" : "text-gray-200 hover:bg-gray-700"
                  }`
                }
              >
                Alerts
              </NavLink>
              <NavLink
                to="/alert-settings"
                className={({ isActive }) =>
                  `px-3 py-1 rounded-lg ${isActive ? "bg-white text-gray-900" : "text-gray-200 hover:bg-gray-700"
                  }`
                }
              >
                ⚙️ Alert Settings
              </NavLink>
              <NavLink
                to="/api-keys"
                className={({ isActive }) =>
                  `px-3 py-1 rounded-lg ${isActive ? "bg-white text-gray-900" : "text-gray-200 hover:bg-gray-700"
                  }`
                }
              >
                API Keys
              </NavLink>
            </nav>
          )}
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition transform hover:scale-105 text-sm font-medium"
            title={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
          >
            {t("switchToEnglish")}
          </button>
          {user && (
            <>
              <span className="text-sm text-gray-300">
                {t("welcome")},{" "}
                <span className="font-semibold">{user.username || user.email}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition transform hover:scale-105 text-sm font-medium"
              >
                {t("logout")}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
