import React, { createContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { auth } from "../lib/firebase.js"; // Import from our new firebase config

export const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider mounted. Waiting for Firebase auth state...");

    // This is the core of Firebase Auth: an observer that listens for login/logout changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Firebase onAuthStateChanged triggered. User:", currentUser);
      setUser(currentUser);
      setIsLoading(false);
    }, (error) => {
      // Added error handling for the listener itself
      console.error("Error in onAuthStateChanged listener:", error);
      setIsLoading(false); // Stop loading even if there's an error
    });

    // Cleanup subscription on unmount
    return () => {
      console.log("AuthProvider unmounted. Cleaning up subscription.");
      unsubscribe();
    };
  }, []);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };
  
  console.log("AuthProvider rendering. Is loading:", isLoading);

  // We don't render the app until we've checked the auth state
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

