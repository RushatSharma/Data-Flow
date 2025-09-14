import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx"; // We'll create AuthContext in the next step

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}