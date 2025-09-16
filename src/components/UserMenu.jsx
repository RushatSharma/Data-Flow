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

  // A small adjustment to get the user's name, falling back to the email
  const userName = user.displayName || user.email;

  return (
    <div className="relative" ref={menuRef}>
      <Button variant="ghost" size="sm" onClick={() => setShowMenu(!showMenu)} className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-accent-foreground" />
        </div>
        <span className="hidden md:inline">{userName}</span>
      </Button>

      {/* MODIFIED DROPDOWN MENU */}
      <Card
        className={`
          absolute right-0 top-full mt-2 w-56 z-20 shadow-lg
          origin-top-right transition-all duration-150 ease-out
          ${showMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        `}
      >
        <div className="p-2">
          <div className="px-2 py-1.5 text-sm">
            <p className="font-semibold truncate">{userName}</p>
            <p className="text-muted-foreground text-xs truncate">{user.email}</p>
          </div>
        </div>
        <div className="border-t border-border p-1">
          <Link to="/history" onClick={() => setShowMenu(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start font-normal">
              <History className="w-4 h-4 mr-2" />
              Upload History
            </Button>
          </Link>
        </div>
        <div className="border-t border-border p-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start font-normal text-destructive hover:text-destructive"
            onClick={() => { logout(); setShowMenu(false); }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}