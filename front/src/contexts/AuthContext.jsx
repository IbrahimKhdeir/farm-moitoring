import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const token = Cookies.get("token");
    const savedUser = Cookies.get("user");

    if (!token) {
      setLoading(false);
      return;
    }

    // Optimistic update
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setLoading(false); // Enable immediate rendering
      } catch (error) {
        console.error("Error parsing saved user cookie:", error);
      }
    }

    // Validate token with backend
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            Cookies.set("user", JSON.stringify(data), { expires: 7 });
            setUser(data);
            setIsAuthenticated(true);
          }
        } else {
          // Only logout on auth errors
          if (response.status === 401 || response.status === 403) {
            Cookies.remove("token");
            Cookies.remove("user");
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth me error:", error);
        // Keep optimistic state on network error
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API_BASE_URL]);
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();

      if (result.status !== "success" || !result.data?.token) {
        return false;
      }

      const token = result.data.token;

      // Save token in cookies
      Cookies.set("token", token, { expires: 7 });

      // Optional: Save minimal user info
      const userData = { email }; // you can add more if backend returns it
      Cookies.set("user", JSON.stringify(userData), { expires: 7 });

      setIsAuthenticated(true);
      setUser(userData);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };


  const logout = async () => {
    try {
      const token = Cookies.get("token");
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: token
          ? {
            Authorization: `Bearer ${token}`,
          }
          : {},
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Delete all cookies
    Cookies.remove("token");
    Cookies.remove("user");

    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

