import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart3, Upload, Home } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/upload", label: "Upload", icon: Upload },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">ProInsight</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth text-sm font-medium",
                  location.pathname === href
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <div className="md:hidden">
            <button className="p-2 rounded-lg hover:bg-muted/50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
