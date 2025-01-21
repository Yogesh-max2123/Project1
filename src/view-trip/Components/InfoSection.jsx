import React, { useEffect, useState } from 'react';
import { ImShare } from "react-icons/im";

function InfoSection({ trip }) {
  const [locationPhoto, setLocationPhoto] = useState("/img1.jpg"); // Default image
  const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';
  const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_ACESS_KEY; // Access API key from .env.local

  const location = trip?.userSelection?.location;

  useEffect(() => {
    if (!location) {
      console.log("Location is not available");
      return;
    }

    const fetchLocationPhoto = async () => {
      try {
        // Step 1: Fetch photos from Unsplash API
        const response = await fetch(
          `${UNSPLASH_API_URL}?query=${encodeURIComponent(location)}&per_page=1&client_id=${UNSPLASH_API_KEY}`,
        );

        const data = await response.json();
        console.log("Unsplash API response:", data); // Log the response

        if (data.results && data.results.length > 0) {
          const photoUrl = data.results[0].urls.regular; // Get the regular photo URL
          setLocationPhoto(photoUrl);
        } else {
          console.log("No photos found for this location.");
          setLocationPhoto("/img1.jpg"); // Default image if no photos
        }
      } catch (error) {
        console.error("Error fetching location photo from Unsplash:", error);
      }
    };

    fetchLocationPhoto();
  }, [location, UNSPLASH_API_KEY]);

  return (
    <div>
      <img className="h-[400px] w-full object-cover rounded-xl" src={locationPhoto} alt={location || "Location"} />
      <div className="flex justify-between items-center">
        <div className="my-5 flex flex-col gap-2">
          <h2 className="font-bold text-2xl">{location}</h2>
          <div className="flex gap-5">
            <h2 className="p-1 px-3 rounded-full text-gray-500 bg-gray-200 font-semibold text-lg">
              🗓️ {trip?.userSelection?.noOfDays} Days
            </h2>
            <h2 className="p-1 px-3 rounded-full text-gray-500 bg-gray-200 font-semibold text-lg">
              💰 {trip?.userSelection?.budget} Budget
            </h2>
            <h2 className="p-1 px-3 rounded-full text-gray-500 bg-gray-200 font-semibold text-lg">
              🥂 {trip?.userSelection?.travellers} Peoples
            </h2>
          </div>
        </div>
        <button className="bg-zinc-400 text-2xl">
          <ImShare />
        </button>
      </div>
    </div>
  );
}

export default InfoSection;
