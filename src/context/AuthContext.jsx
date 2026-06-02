import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(false);

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

export default AuthContext;
export { AuthProvider };
