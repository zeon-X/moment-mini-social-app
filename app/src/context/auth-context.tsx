import { getMe } from "@/services/modules/auth.service";
import { UserInfo } from "@/types/user";
import { showErrorAlert } from "@/utils/error-handler";
import { globalLogout } from "@/utils/logout-handler";
import {
  deleteFromSecureStore,
  getFromSecureStore,
} from "@/utils/useSecureStorage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextProps {
  token: string | null;
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  setToken: (token: string | null) => void;
  setUserInfo: (profile: UserInfo | null) => void;
  setSession: (token: string) => Promise<void>;
  clearSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await getFromSecureStore("token");
        setToken(storedToken);
        setIsAuthenticated(!!storedToken);

        if (storedToken) {
          await handleFetchUserInfo();
        }
      } catch (error) {
        showErrorAlert(error, "Unable to restore your session.");
      } finally {
        setLoading(false);
      }
    };

    loadSession();
    globalLogout.handler = clearSession;
    return () => {
      globalLogout.handler = null;
    };
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  useEffect(() => {
    globalLogout.handler = clearSession;
    return () => {
      globalLogout.handler = null;
    };
  }, []);

  const handleFetchUserInfo = async () => {
    setLoading(true);
    try {
      const data = await getMe();
      if (data.success) {
        setUser(data.data);
      } else {
        showErrorAlert(data.message, "Unable to load your profile.");
      }
    } catch (error) {
      showErrorAlert(error, "Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  // Example: Save token to secure store on login
  const setSession = async (newToken: string) => {
    // setLoading(true);
    // Save token to secure store
    // You may want to use expo-secure-store's setItemAsync here
    // For now, just update state
    setToken(newToken);
    setIsAuthenticated(true);
    // setLoading(false);
  };

  const setUserInfo = (profile: UserInfo | null) => {
    setUser(profile);
  };

  // Example: Remove token from secure store on logout
  const clearSession = async () => {
    try {
      setToken(null);
      setIsAuthenticated(false);

      await deleteFromSecureStore("token");
    } catch (error) {
      showErrorAlert(error, "Unable to clear your session.");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userInfo: user,
        isAuthenticated,
        loading,
        setToken,
        setUserInfo,
        setSession,
        clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
