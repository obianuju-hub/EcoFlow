"use client";

import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Leaf, Home, Upload, LogIn, LogOut, Clock } from "lucide-react";
import { usePathname } from "next/navigation";

const NavbarComponent = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" }); // redirects after sign out
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-100 fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">

            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="text-xl font-semibold text-green-800">EcoRate</span>
              </Link>
            </div>

            {/* Nav Links */}
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className={`nav-link ${pathname === "/" ? "text-green-600" : "text-gray-600"}`}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>

              {session && (
                <>
                  <Link
                    href="/Homepage"
                    className={`nav-link ${pathname === "/Homepage" ? "text-green-600" : "text-gray-600"}`}
                  >
                    <Upload className="h-5 w-5" />
                    <span>Upload</span>
                  </Link>

                  <Link
                    href="/History"
                    className={`nav-link ${pathname === "/History" ? "text-green-600" : "text-gray-600"}`}
                  >
                    <Clock className="h-5 w-5" />
                    <span>History</span>
                  </Link>
                </>
              )}

              {session ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Log Out</span>
                </button>
              ) : (
                <Link
                  href="/Signin"
                  className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarComponent;