"use client";

import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  role: string;
  // Thêm các trường thông tin người dùng khác nếu có
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: string | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    setRole(userData.role);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setRole(null);
  };

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/auth/me", {
        withCredentials: true,
      });
      if (response.status === 200 && response.data.user) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        setRole(userData.role);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, role, isLoading, login, logout, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
}
