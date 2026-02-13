import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types";
import {
  getAuthToken,
  getUserId,
  getUserRoles,
  clearAuth,
} from "../utils/auth";
import { authService } from "../services/authService";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_TOKEN"; payload: string | null }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGOUT" };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    case "SET_TOKEN":
      return {
        ...state,
        token: action.payload,
        isAuthenticated: !!action.payload,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      clearAuth();
      return {
        ...initialState,
        isLoading: false,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  dispatch: React.Dispatch<AuthAction>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = getAuthToken();
    const userId = getUserId();

    if (token && userId) {
      dispatch({ type: "SET_TOKEN", payload: token });

      try {
        // Fetch user profile to get complete user data
        const userData = await authService.getUserProfile();
        dispatch({ type: "SET_USER", payload: userData });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // If we can't fetch user profile, clear auth
        clearAuth();
      }
    }

    dispatch({ type: "SET_LOADING", payload: false });
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getUserProfile();
      dispatch({ type: "SET_USER", payload: userData });
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const hasRole = (role: string): boolean => {
    if (state.user?.roles) {
      return state.user.roles.includes(role);
    }

    // Fallback to cookie-based role check
    const userRoles = getUserRoles();
    return userRoles.includes(role);
  };

  const value: AuthContextType = {
    ...state,
    dispatch,
    logout,
    hasRole,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
