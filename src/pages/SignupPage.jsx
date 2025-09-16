import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Label } from "../components/ui/Label.jsx";
import { Database, Loader2, Eye, EyeOff, Home } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await signup(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Link to="/" className="absolute top-4 left-4">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Home className="w-4 h-4" /> <span>Home</span>
            </Button>
        </Link>
      <Card className="w-full max-w-lg p-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
            <Database className="w-7 h-7 text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-base text-muted-foreground mt-2">Start transforming your data with Data Flow</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-2" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>

          {error && <p className="text-base text-destructive">{error}</p>}

          <Button type="submit" className="w-full text-lg py-3 h-12" disabled={isLoading}>
            {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating Account...</> : "Create Account"}
          </Button>
        </form>
        <div className="mt-8 text-center">
          <p className="text-base text-muted-foreground">
            Already have an account? <Link to="/login" className="text-accent hover:underline font-semibold">Sign in</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}