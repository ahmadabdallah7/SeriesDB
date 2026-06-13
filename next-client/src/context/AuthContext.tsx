"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Types
type AuthContextType = {
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [isLogged, setIsLogged] = useState<boolean>(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await axios.get("http://localhost:3000/auth/status", {
          withCredentials: true,
        });

        setIsLogged(response.data.isAuthenticated);
      } catch (error) {
        console.log(error);
        setIsLogged(false);
      }
    }
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLogged, setIsLogged }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export default AuthContext;
export { AuthProvider, useAuth };
