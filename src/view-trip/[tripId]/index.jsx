import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { doc } from 'firebase/firestore';
import { db } from '@/service/firebase';
import { getDoc } from 'firebase/firestore';
import InfoSection from '../Components/InfoSection';
import { useState } from 'react';
import Hotels from '../Components/Hotels';
import PlacesToVisit from '../Components/PlacesToVisit';
import Footer from '../Components/Footer';
import { toast } from 'sonner';
function ViewTrip() {
const {tripId} = useParams();
const [trip,setTrip] = useState([]);


useEffect(() => {
   tripId && getTripData();
},[tripId]);


   
    const getTripData = async () => {
        const docRef = doc(db,"AITrips",tripId);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            console.log("Document data:", docSnap.data());
            setTrip(docSnap.data());
        }
        else{
            console.log("No such document!");
            toast('No Trip Found!');
        }
    }





    return(
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'> 
        {/* InfoSection */}
        <InfoSection trip={trip}/>

        {/* Recommended Hotels */}
        <Hotels trip = {trip}/>

        {/* Daily Plan */}
        <PlacesToVisit trip = {trip}/>

        {/* Footer */}
        <Footer trip={trip}/>
    </div>
    );
}

export default ViewTrip