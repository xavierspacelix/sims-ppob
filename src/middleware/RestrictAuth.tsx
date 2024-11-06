import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/srote";
import illustrationLogin from "../assets/IllustrasiLogin.png";
import logo from "../assets/Logo.png";
interface RestrictAuthProps {
  children: JSX.Element;
  header: JSX.Element;
}

const RestrictAuth: React.FC<RestrictAuthProps> = ({ children, header }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return isAuthenticated ? (
    <Navigate to="/" replace />
  ) : (
    <div className="min-h-screen w-full flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 text-xl font-bold text-red-600">
              <img src={logo} alt="Logo" className="w-6 h-6" />
              SIMS PPOB
            </div>
            <h1 className="mt-6 text-2xl font-semibold">{header}</h1>
          </div>
          {children}
        </div>
      </div>
      <div className="hidden lg:flex flex-1 relative bg-pink-50">
        <img
          src={illustrationLogin}
          alt="Illustration"
          width={400}
          height={400}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default RestrictAuth;
