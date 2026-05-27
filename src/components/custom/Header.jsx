import React, { useEffect, useState } from 'react';
import { googleLogout } from '@react-oauth/google';
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

function Header() {
  const [openDialogue, setOpenDialogue] = useState(false);
  const [user, setUser] = useState(null);

  // Environment-based redirect URI
  const redirectUri = import.meta.env.PROD
    ? import.meta.env.VITE_VERCEL_REDIRECT_URI
    : import.meta.env.VITE_HOST_REDIRECT_URI;

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (!tokenResponse || !tokenResponse.access_token) {
        toast.error("Login failed. Please try again.");
        return;
      }
      await getUserProfile(tokenResponse);
    },
    onError: () => {
      toast.error("Login failed. Please try again.");
    },
    scope: "profile email",
  });

  const getUserProfile = async (tokenResponse) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setOpenDialogue(false);
      toast.success("User logged in successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to fetch user profile. Please try again.");
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    setUser(null);
    window.location.reload();
  };

  return (
    <nav className='navbar'>
      <div className='navbar-brand'>
        {/* Custom Logo with gradient */}
        <div className='logo'>
          <div className='logo-icon'>✈️</div>
          <span className='hidden sm:inline'>JourneyAI</span>
        </div>
      </div>

      {user ? (
        <div className='flex items-center gap-6'>
          {/* Add Trip Button */}
          <a href="/create-trip" className='hidden sm:block'>
            <button className='btn btn-secondary'>
              ✨ New Trip
            </button>
          </a>

          {/* My Trips Button */}
          <a href="/my-trip" className='hidden sm:block'>
            <button className='btn btn-secondary'>
              📋 My Trips
            </button>
          </a>

          {/* User Profile Popover */}
          <Popover>
            <PopoverTrigger className='focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500'>
              <img 
                className='h-10 w-10 rounded-full border-2 border-primary-200 hover:border-primary-500 transition-colors cursor-pointer' 
                src={user?.picture} 
                alt={user?.name}
                title={user?.name}
              />
            </PopoverTrigger>
            <PopoverContent className='cursor-pointer bg-white border border-neutral-200 rounded-lg shadow-lg'>
              <div className='space-y-3'>
                <div className='px-4 py-2 border-b border-neutral-100'>
                  <p className='text-sm font-medium text-neutral-900'>{user?.name}</p>
                  <p className='text-xs text-neutral-500'>{user?.email}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className='w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors text-left'
                >
                  🚪 Logout
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Mobile Menu Button */}
          <a href="/create-trip" className='sm:hidden'>
            <button className='btn'>+</button>
          </a>
        </div>
      ) : (
        <button 
          onClick={() => setOpenDialogue(true)}
          className='btn'
        >
          🔐 Sign In
        </button>
      )}

      {/* Login Dialog */}
      <Dialog onOpenChange={(isOpen) => setOpenDialogue(isOpen)} open={openDialogue}>
        <DialogContent className='bg-white rounded-xl border border-neutral-200 shadow-xl'>
          <DialogHeader>
            <DialogDescription className='space-y-6'>
              {/* Logo Section */}
              <div className='flex justify-center pt-6'>
                <div className='text-6xl'>✈️</div>
              </div>

              {/* Title */}
              <h2 className='text-center text-2xl font-bold text-neutral-900'>
                Welcome to JourneyAI
              </h2>

              {/* Description */}
              <p className='text-center text-neutral-600'>
                Sign in to start planning your next adventure with AI-powered personalized itineraries.
              </p>

              {/* Google Login Button */}
              <button 
                onClick={() => login()}
                className='w-full bg-white border-2 border-neutral-200 hover:border-primary-500 hover:bg-primary-50 transition-all rounded-lg py-3 px-4 flex items-center justify-center gap-3 font-semibold text-neutral-900'
              >
                <FcGoogle className='h-6 w-6' />
                Sign In with Google
              </button>

              {/* Footer */}
              <p className='text-center text-xs text-neutral-500'>
                We'll never share your information. By signing in, you agree to our Terms of Service.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </nav>
  );
}

export default Header;
