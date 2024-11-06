import React, { useState } from "react";
import { Link, Navigate, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/srote";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import logo from "../assets/Logo.png";
interface RequireAuthProps {
  children: JSX.Element;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = token || localStorage.getItem("token");
  return isAuthenticated ? (
    <>
      <div className="min-h-screen ">
        <header className="border-b bg-white sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/">
              <div className="flex items-center gap-2 text-xl font-bold text-red-600">
                <img src={logo} alt="Logo" className="w-6 h-6" />
                SIMS PPOB
              </div>
            </Link>
            <nav className="hidden md:flex gap-6">
              <NavLink
                to="/topup"
                className={({ isActive }) =>
                  isActive
                    ? "text-red-600 font-bold"
                    : "text-gray-600 hover:text-gray-900 font-semibold"
                }
              >
                Top Up
              </NavLink>
              <NavLink
                to="/transaction"
                className={({ isActive }) =>
                  isActive
                    ? "text-red-600 font-bold"
                    : "text-gray-600 hover:text-gray-900 font-semibold"
                }
              >
                Transaction
              </NavLink>
              <NavLink
                to="/account"
                className={({ isActive }) =>
                  isActive
                    ? "text-red-600 font-bold"
                    : "text-gray-600 hover:text-gray-900 font-semibold"
                }
              >
                Akun
              </NavLink>
            </nav>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
          {isMenuOpen && (
            <nav className="md:hidden border-t">
              <NavLink
                to="/topup"
                className={({ isActive }) =>
                  isActive
                    ? "text-red-600 font-bold block px-4 py-2"
                    : "block px-4 py-2 text-gray-600 hover:bg-gray-100"
                }
              >
                Top Up
              </NavLink>
              <NavLink
                to="/transaction"
                className={({ isActive }) =>
                  isActive
                    ? "text-red-600 font-bold block px-4 py-2"
                    : "block px-4 py-2 text-gray-600 hover:bg-gray-100"
                }
              >
                Transaction
              </NavLink>
              <NavLink
                to="/account"
                className={({ isActive }) =>
                  isActive
                    ? "text-red-600 font-bold block px-4 py-2"
                    : "block px-4 py-2 text-gray-600 hover:bg-gray-100"
                }
              >
                Akun
              </NavLink>
            </nav>
          )}
        </header>
        {children}
      </div>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default RequireAuth;
