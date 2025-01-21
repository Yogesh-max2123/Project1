import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CreateTrip from './create-trip'
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom'
import Header from './components/custom/Header'
import { Toaster } from 'sonner'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ViewTrip from './view-trip/[tripId]'
import MyTrip from './my-trip'



const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/create-trip',
    element: <CreateTrip/>
  },
  {
    path: '/view-trip/:tripId',
    element: <ViewTrip/>
  },
  {
    path:'/my-trip',
    element: <MyTrip/>
  }
])

const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <Header></Header>
      <Toaster></Toaster>
      <RouterProvider router = {router}></RouterProvider>
    </GoogleOAuthProvider>
  </StrictMode>
)
