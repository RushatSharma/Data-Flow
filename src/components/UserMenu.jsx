import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { User, LogOut, History } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);


  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <Button variant="ghost" size="sm" onClick={() => setShowMenu(!showMenu)} className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-accent-foreground" />
        </div>
        <span className="hidden md:inline">{user.username}</span>
      </Button>

      {showMenu && (
        <Card className="absolute right-0 top-full mt-2 w-48 p-2 z-20">
          <div className="space-y-1">
            <div className="px-3 py-2 text-sm">
              <p className="font-medium">{user.username}</p>
              <p className="text-muted-foreground text-xs">{user.email}</p>
            </div>
            <hr className="my-1" />
            <Link to="/history" onClick={() => setShowMenu(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <History className="w-4 h-4 mr-2" />
                Upload History
              </Button>
            </Link>
            <hr className="my-1" />
            <Button variant="ghost" size="sm" className="w-full justify-start text-destructive" onClick={() => { logout(); setShowMenu(false); }}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}