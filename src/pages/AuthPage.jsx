import React, { useState } from 'react';
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";


export default function AuthPage() {
  // Track whether the user is on the "Sign In" or "Sign Up" tab
  const [isSignIn, setIsSignIn] = useState(true);

  // Sign up and sign in.... details
   const { signInWithGitHub, signOut, user } = useAuth();
  
  // Track input form data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle your authentication logic here
    console.log(isSignIn ? 'Logging in...' : 'Signing up...', { email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg p-4">
      {/* Main Container Box */}
      <div className="flex h-auto min-h-[550px] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl md:h-[550px]">
        
        {/* Left Side: 20% Width Column (HIDDEN ON MOBILE, VISIBLE ON MD+ SCREENS) */}
        <div className="hidden w-1/5 flex-col bg-gray-900 text-white md:flex">
          {/* Upper Section of Left Side (GitHub Indicator) */}
          <div className="flex h-1/2 flex-col items-center justify-center border-b border-gray-800 p-4 text-center">
            <svg className="h-8 w-8 mb-2 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="text-xs font-semibold tracking-wider uppercase">GitHub Auth</span>
          </div>

          {/* Lower Section of Left Side (Email Indicator) */}
          <div className="flex h-1/2 flex-col items-center justify-center p-4 text-center">
            <svg className="h-8 w-8 mb-2 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-semibold tracking-wider uppercase">Email Auth</span>
          </div>
        </div>

        {/* Right Side: 100% Width on Mobile, 80% Width on Desktop */}
        <div className="flex w-full flex-col bg-gray-50 md:w-4/5">
          
          {/* Top Segment: Auth Toggle Navigation */}
          <div className="flex h-14 border-b border-gray-200 bg-white">
            <button
              onClick={() => setIsSignIn(true)}
              className={`flex-1 font-medium transition-colors ${
                isSignIn 
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/30' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignIn(false)}
              className={`flex-1 font-medium transition-colors ${
                !isSignIn 
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/30' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col justify-between p-6 sm:p-8 lg:p-12">
            
            {/* Top 80% Action: GitHub Social Button */}
            <div className="flex flex-1 flex-col justify-center border-b border-dashed border-gray-200 pb-6 min-h-[100px]">
              <button 
                type="button" 
                className="flex w-full items-center justify-center gap-3 rounded-lg bg-black px-5 py-3 text-white transition-all hover:bg-gray-800 shadow-md font-medium"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                {isSignIn ? 'Sign In with GitHub' : 'Sign Up with GitHub'}
              </button>
            </div>

            {/* Bottom Form Action: Traditional Email Credentials */}
            <form onSubmit={handleSubmit} className="flex flex-col justify-center pt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-all hover:bg-blue-700 shadow-md focus:ring-2 focus:ring-blue-200"
              >
                {isSignIn ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
