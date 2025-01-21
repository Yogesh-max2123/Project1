import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function UserTripCard({ trip }) {
    const [photoUrl, setPhotoUrl] = useState('/img1.jpg'); // Default placeholder image
    const PEXELS_API_URL = 'https://api.pexels.com/v1/search';
    const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY; // Your Pexels API key

    const location = trip?.userSelection?.location;

    useEffect(() => {
        const fetchPhoto = async () => {
            if (!location) return;

            try {
                const response = await axios.get(PEXELS_API_URL, {
                    headers: {
                        Authorization: PEXELS_API_KEY,
                    },
                    params: {
                        query: location,
                        per_page: 1,
                    },
                });

                if (response.data.photos && response.data.photos.length > 0) {
                    setPhotoUrl(response.data.photos[0].src.medium); // Use the first photo's medium-sized URL
                }
            } catch (error) {
                console.error('Error fetching photo from Pexels API:', error);
            }
        };

        fetchPhoto();
    }, [location, PEXELS_API_KEY]);

    return (
        <Link to={'/view-trip/'+trip?.id}>
        <div>
            <img className="rounded-2xl mt-3 mb-2 h-[200px] w-full object-cover hover:scale-110 transition-all" src={photoUrl} alt={location || 'Location'} />
            <div>
                <h2 className="font-bold text-lg">{location}</h2>
                <h2 className="text-gray-500 font-semibold text-lg">
                    {trip?.userSelection?.noOfDays} Days trip with {trip?.userSelection?.budget} Budget
                </h2>
            </div>
        </div>
        </Link>
    );
}

export default UserTripCard;
