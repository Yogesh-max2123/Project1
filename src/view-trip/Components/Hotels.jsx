import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Hotels({ trip }) {
  const [hotelPhotos, setHotelPhotos] = useState({});

  const hotelOptions = trip?.tripData?.hotel_options;
  const PEXELS_API_URL = 'https://api.pexels.com/v1/search';
  const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY; // Replace with your Pexels API key

  // Fetch hotel photos using Pexels API
  const fetchHotelPhotos = async (hotelName, hotelAddress) => {
    try {
      const response = await fetch(
        `${PEXELS_API_URL}?query=${encodeURIComponent(hotelName + ' ' + hotelAddress)}&per_page=1`,
        {
          headers: {
            Authorization: PEXELS_API_KEY, // Pass the API key in headers
          },
        }
      );

      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        const photoUrl = data.photos[0].src.medium; // Use medium-sized image
        setHotelPhotos((prevPhotos) => ({
          ...prevPhotos,
          [hotelName]: photoUrl, // Use hotel name as the key
        }));
      } else {
        console.log(`No photos found for ${hotelName}`);
      }
    } catch (error) {
      console.error('Error fetching hotel photo from Pexels:', error);
    }
  };

  // Fetch hotel details and photos
  const fetchHotelDetails = async () => {
    if (!hotelOptions) return;

    for (let hotel of hotelOptions) {
      const { hotel_name, hotel_address } = hotel;
      fetchHotelPhotos(hotel_name, hotel_address); // Fetch photos for each hotel
    }
  };

  useEffect(() => {
    fetchHotelDetails();
  }, [hotelOptions]);

  return (
    <div>
      <h2 className="font-bold text-2xl">Recommended Hotels</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {hotelOptions?.map((item, index) => {
          const hotelPhoto = hotelPhotos[item.hotel_name] || '/img1.jpg'; // Fallback to default image
          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.hotel_name + ', ' + item.hotel_address)}`;

          return (
            <Link to={googleMapsUrl} target="_blank" className="text-blue-500" key={index}>
              <div className="mt-5 hover:scale-110 transition-all">
                <img className="rounded-xl h-[200px] w-full object-cover" src={hotelPhoto} alt={item.hotel_name} />
                <div className="my-2 flex flex-col gap-2">
                  <h2 className="text-lg font-semibold">{item.hotel_name}</h2>
                  <h2 className="text-gray-800 text-xs"> 📍{item.hotel_address}</h2>
                  <h2 className="text-base font-medium">💵 {item.price}</h2>
                  <h2 className="text-base font-medium">Rating: {item.rating} ⭐</h2>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Hotels;
