import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { query, where, collection, getDocs } from 'firebase/firestore';
import { db } from '@/service/firebase';
import UserTripCard from './UserTripCard';

function MyTrip() {
    const navigate = useNavigate(); 
    const [userTrips,setUserTrips] = useState([]);

    useEffect(() => {
        getUserTrips();
    }, []);

    const getUserTrips = async () => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            navigate('/'); 
            return;
        }

        try {
            const q = query(
                collection(db, 'AITrips'),
                where('userEmail', '==', user?.email)
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data());
                setUserTrips(prevVal=>[...prevVal,doc.data()])
            });
        } catch (error) {
            console.error('Error fetching trips:', error);
        }
    };

    return <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
                <h2 className='font-bold text-5xl font-sans'>My Trip</h2>
                <div className='grid grid-cols-2 md:grid-cols-3 mt-10 gap-5'>
                    {userTrips.length>0 ? userTrips.map((trip,index)=>(
                        <UserTripCard trip = {trip}/>
                    ))
                :[1,2,3,4,5,6].map((item,index)=>(
                    <div key={index} className='bg-gray-200 h-[300px] w-full rounded-xl animate-pulse'></div>
                ))}
                </div>
            </div>;
    
}

export default MyTrip;
