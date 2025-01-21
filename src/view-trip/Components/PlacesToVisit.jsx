import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PlacesToVisit({ trip }) {
    const [photos, setPhotos] = useState({});
    const itinerary = trip?.tripData?.itinerary;

    const PEXELS_API_URL = 'https://api.pexels.com/v1/search';
    const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY; // Replace with your Pexels API key

    // Fetch photos using Pexels API
    const fetchPhotos = async (placeName) => {
        try {
            const response = await axios.get(PEXELS_API_URL, {
                headers: {
                    Authorization: PEXELS_API_KEY,
                },
                params: {
                    query: placeName,
                    per_page: 1, // Limit to one photo per place
                },
            });

            if (response.data.photos.length > 0) {
                // Return the URL of the first photo
                return response.data.photos[0].src.medium;
            }
        } catch (error) {
            console.error('Error fetching photos from Pexels API:', error);
        }
        return null; // Return null if no photo is found
    };

    // Load photos for all places in the itinerary
    useEffect(() => {
        const loadPhotos = async () => {
            if (itinerary) {
                const photoPromises = Object.entries(itinerary).flatMap(([day, details]) =>
                    details.places.map(async (place) => {
                        const photo = await fetchPhotos(place.place_name);
                        return { key: `${day}-${place.place_name}`, photo };
                    })
                );

                const results = await Promise.all(photoPromises);
                const photoMap = results.reduce((acc, item) => {
                    if (item.photo) acc[item.key] = item.photo;
                    return acc;
                }, {});

                setPhotos(photoMap);
            }
        };

        loadPhotos();
    }, [itinerary]);

    return (
        <div>
            <h2 className="text-2xl font-bold">Places To Visit</h2>
            <div>
                {itinerary ? (
                    Object.entries(itinerary).map(([day, details], dayIndex) => (
                        <div key={dayIndex} className="mb-6">
                            <h3 className="text-lg font-semibold">Day: {day}</h3>
                            <p className="italic text-gray-600">Theme: {details.theme}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 rounded-2xl">
                                {details.places.map((place, placeIndex) => {
                                    const photoKey = `${day}-${place.place_name}`;
                                    const photoUrl = photos[photoKey];
                                    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.place_name + ', ' + place.address)}`;

                                    return (
                                        <Link to={googleMapsUrl} target="_blank" key={placeIndex}>
                                            <div
                                                className="p-4 border shadow hover:scale-110 transition-all rounded-3xl"
                                            >
                                                <h4 className="font-bold text-lg">{place.place_name}</h4>
                                                <div>
                                                    <img
                                                        className="rounded-2xl mt-3 mb-2 h-[200px] w-full object-cover"
                                                        src={photoUrl || '/placeholder.jpg'} // Fallback to placeholder
                                                        alt={place.place_name}
                                                    />
                                                </div>
                                                <p className="text-gray-700">
                                                    <strong>Address:</strong> {place.address || 'N/A'}
                                                </p>
                                                <p className="text-gray-700">
                                                    <strong>Timing:</strong> {place.timing || 'N/A'}
                                                </p>
                                                <p className="text-gray-700">
                                                    <strong>Ticket Pricing:</strong> {place.ticket_pricing || 'Free'}
                                                </p>
                                                <p className="text-gray-700">
                                                    <strong>Rating:</strong> {place.rating || 'Not Rated'} ⭐
                                                </p>
                                                <p className="text-gray-700">
                                                    <strong>Description:</strong> {place.description || 'No Description'}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No itinerary available.</p>
                )}
            </div>
        </div>
    );
}

export default PlacesToVisit;
