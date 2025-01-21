import React, { useEffect, useState } from "react";
import travelAffordabilityOptions from "@/constants/budgetOptions";
import travelOptions from "@/constants/travelOptions";
import { toast } from "sonner"
import { AI_Prompt } from "@/constants/aiPrompt";
import { chatSession } from "@/service/AIModel";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

import { setDoc } from "firebase/firestore";
import { Dock } from "lucide-react";
import { db } from "@/service/firebase";
import { doc } from "firebase/firestore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";


function CreateTrip() {
  const [query, setQuery] = useState(""); // User's input in the autocomplete field
  const [suggestions, setSuggestions] = useState([]); // Autocomplete suggestions
  const [selectedLocation, setSelectedLocation] = useState(null); // Selected location
  const [formData,setFormData] = useState([]);
  const [openDialogue,setOpenDialogue] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange2 = (name,value) =>{
    setFormData({
      ...formData,
      [name]:value
    })
  }
  useEffect(()=>{
    console.log(formData);

  },[formData])
  console.log("Client ID:", import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
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
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to fetch user profile. Please try again.");
    }
  };
  

  const handleGenerateTrip = async () => {
    const user = localStorage.getItem("user");
  
    if (!user) {
      setOpenDialogue(true);
     return;
     }
  
    // Log formData to check its values
    console.log("Form Data:", formData);
  
    if (!formData?.noOfDays || !formData?.travellers || !formData?.budget || !formData?.location) {
      toast.error("Please fill in all details.");
      return;
    }
  
    setLoading(true);
    const Final_Prompt = AI_Prompt
      .replace("{location}", formData?.location || "a beautiful place")
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{travellers}", formData?.travellers)
      .replace("{budget}", formData?.budget);
  
    console.log("Generated Prompt:", Final_Prompt);
  
    try {
      const result = await chatSession.sendMessage(Final_Prompt);
      const aiResponse = await result?.response?.text();
      console.log("AI Response:", aiResponse);
  
      if (aiResponse) {
        await SaveAiTrip(aiResponse);
      } else {
        toast.error("Failed to generate trip. Please try again.");
      }
    } catch (error) {
      console.error("Error generating trip:", error);
      toast.error("Failed to generate trip. Please try again.");
    }
    setLoading(false);
  };
  
  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString();
    try {
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: JSON.parse(TripData),
        userEmail: user?.email,
        id: docId
      });
      toast.success("Trip saved successfully!");
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error("Failed to save trip. Please try again.");
    }
    setLoading(false);
    navigate('/view-trip/'+docId);

  };
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 0) {
      // Fetch autocomplete suggestions from Radar API
      try {
        const response = await fetch(
          `https://api.radar.io/v1/search/autocomplete?query=${value}&near=40.73430,-73.99110`,
          {
            headers: {
              Authorization: "prj_test_pk_c094c49e7ae051db01a1b18781b3958d59ed5eac",
            },
          }
        );

        const data = await response.json();
        if (data.addresses) {
          setSuggestions(data.addresses); // Update suggestions
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]); // Clear suggestions if input is empty
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const address = suggestion.formattedAddress || suggestion.addressLabel || "Unknown Location";
    setSelectedLocation(suggestion);
    setQuery(address);
    setSuggestions([]);
    handleInputChange2("location", address); // Save the location in formData
  };
  
  

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 style={{ fontWeight: 700 }} className="font-bold text-[35px] mx-56">
        Tell us your travel preferences🌴🏕️
      </h2>
      <p
        style={{ fontWeight: 600 }}
        className="mt-3 text-gray-500 text-[25px] font-semibold mx-56"
      >
        Just provide some basic information for your trip, and our trip planner
        will generate a customized itinerary based{" "}
      </p>
      <p className="mt-3 text-gray-500 text-[25px] font-semibold mx-56">
        on your preferences.
      </p>
      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-3xl font-medium my-3 mx-56">
            What is your choice of destination?
          </h2>
          <div style={{ position: "relative", width: "75%", margin: "0 auto" }}>
            <input
              style={{
                width: "100%",
                height: "60px",
                borderRadius: "15px",
                border: "2px solid black",
                fontSize: "22px",
                padding: "10px",
              }}
              placeholder={"Start typing..."}
              value={query}
              onChange={handleInputChange}
              type="text"
            />
            {suggestions.length > 0 && (
              <ul
                style={{
                  position: "absolute",
                  top: "65px",
                  width: "100%",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  zIndex: 1000,
                  maxHeight: "200px",
                  overflowY: "auto",
                  padding: "5px 0",
                }}
              >
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.formattedAddress}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {selectedLocation && (
            <div className="mt-4 mx-56">
              <p>
                Selected Location:{" "}
                <strong>{selectedLocation.formattedAddress}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-medium my-3 mx-56">
          How many days are you planning for your trip?
        </h2>
        <input
          style={{
            width: "75%",
            height: "60px",
            borderRadius: "15px",
            border: "2px solid black",
            fontSize: "22px",
            margin: "0 auto",
            display: "block",
          }}
          placeholder={"Ex. 3"}
          type="number"
          onChange={(e)=>
            handleInputChange2('noOfDays',e.target.value)
          }
        />
      </div>
      <div>
        <h2 className="text-3xl font-medium my-3 mx-56">What's your Budget?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5 mx-56">
          {/* Replace `travelAffordabilityOptions` with your actual data */}
          {travelAffordabilityOptions.map((item, index) => (
            <div
              key={index}
              onClick={()=>handleInputChange2('budget',item.title)}
              className={`p-4 border rounded-2xl cursor-pointer hover:shadow-lg ${formData?.budget==item.title && 'shadow-md border-black'}`}
            >
              <h2 className="mx-10 text-4xl font-semibold">{item.icon}</h2>
              <h2 className="mx-10 font-bold text-lg">{item.title}</h2>
              <h2 className="mx-10 text-xl text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>

      </div>
      <div>
        <h2 className="text-3xl font-medium my-3 mx-56">
          Who do you plan on traveling with on your next adventure?
        </h2>
        <div className="grid grid-cols-3 gap-5 mt-5 mx-56">
          {travelOptions.map((item, index) => (
            <div
              key={index}
              onClick={()=>handleInputChange2('travellers',item.people)}
              className={`p-4 border rounded-2xl cursor-pointer hover:shadow-lg ${formData?.travellers==item.people && 'shadow-md border-black'}`}
            >
              <h2 className="mx-10 text-4xl font-semibold">{item.icon}</h2>
              <h2 className="mx-10 font-bold text-lg">{item.title}</h2>
              <h2 className="mx-10 text-xl text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>
      <div className="btn my-10 justify-end flex">


        <button 

        disabled = {loading}
        onClick={handleGenerateTrip}>
        {loading?
        <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" /> :
         'Generate Trip'
        }</button>
      </div>

      <Dialog onOpenChange={(isOpen) => setOpenDialogue(isOpen)} open={openDialogue}>

  <DialogContent className='bg-white rounded-md' style={{border : "1px solid black",borderRadius:"10px"}}>
    <DialogHeader>
     
      <DialogDescription >
        <img className="" src="/logo.svg" />
        <h2 className="font-bold text-xl mt-5"
        >Sign In with Google</h2>
        <p className="mt-2 text-lg">Sign in with Google authentication successfully</p>
        <button className="w-full mt-5 text-white text-lg flex gap-4 items-center " onClick={()=>login()}>
        <FcGoogle className="h-8 w-8"/> Sign In with Google</button>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
  );
}

export default CreateTrip;
