import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

function Header() {
  const [openDialogue, setOpenDialogue] = useState(false);

  // Dynamically set the redirect URI based on environment (production or development)
  const redirectUri = process.env.NODE_ENV === 'production'
    ? 'https://ai-trip-planner1.vercel.app/auth/callback'
    : 'http://localhost:5173/auth/callback';

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Redirect URI:", redirectUri);
      console.log("Token Response:", tokenResponse);
      if (!tokenResponse || !tokenResponse.access_token) {
        console.error("Access token is missing or invalid");
        toast.error("Login failed. Please try again.");
        return;
      }
      await getUserProfile(tokenResponse);
    },
    onError: (errorResponse) => {
      toast.error("Login failed. Please try again.");
      console.error("Login Error:", errorResponse);
    },
    scope: "profile email",
  });

  const getUserProfile = async (tokenResponse) => {
    try {
      console.log("Fetching user profile with token:", tokenResponse.access_token);

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
      console.log("Fetched User Data:", userData);

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      setOpenDialogue(false); // Close dialog
      toast.success("User logged in successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to fetch user profile. Please try again.");
    }
  };

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
      <img className='logo rounded-xl' src="/logo.svg" alt="" />
      {user ? <div className='flex items-center gap-4'>
        <a href="/create-trip">
          <button variant="outline" className='rounded-full bg-slate-200 border-b-slate-800'>+ Add Trip</button>
        </a>
        <a href="/my-trip">
          <button variant="outline" className='rounded-full bg-slate-200 border-b-slate-800'>My Trip</button>
        </a>

        <Popover>
          <PopoverTrigger className='bg-white object-cover'><img className='h-[60px] rounded-full ' src={user?.picture} alt="" /></PopoverTrigger>
          <PopoverContent className='cursor-pointer bg-white'>
            <h2 onClick={() => {
              googleLogout();
              localStorage.clear();
              window.location.reload();
            }}>Logout</h2>
          </PopoverContent>
        </Popover>
      </div> : <Button 
        onClick={() => setOpenDialogue(true)}
        className='rounded-xl bg-black text-lg text-white hover:bg-blue'>
        Sign In
      </Button>}

      <Dialog onOpenChange={(isOpen) => setOpenDialogue(isOpen)} open={openDialogue}>
        <DialogContent className='bg-white rounded-md' style={{border: "1px solid black", borderRadius:"10px"}}>
          <DialogHeader>
            <DialogDescription >
              <img className="" src="/logo.svg" />
              <h2 className="font-bold text-xl mt-5">Sign In with Google</h2>
              <p className="mt-2 text-lg">Sign in with Google authentication successfully</p>
              <button className="w-full mt-5 text-white text-lg flex gap-4 items-center " onClick={() => login()}>
                <FcGoogle className="h-8 w-8"/> Sign In with Google
              </button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;
