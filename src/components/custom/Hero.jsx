import React from 'react'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className='hero'>
      {/* Hero Content */}
      <div className='hero-content fade-in-up'>
        {/* Main Icon */}
        <div className='text-6xl mb-6 drop-shadow-lg'>✈️🌍🗺️</div>

        {/* Headline - Authentic & Personalized */}
        <h1 className='text-4xl md:text-5xl font-bold mb-6 leading-tight'>
          Your <span className='text-primary-500'>Personal Travel</span> Companion
        </h1>

        {/* Subheading */}
        <p className='text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed'>
          Forget generic travel guides. Our AI creates personalized itineraries tailored to <span className='font-semibold text-neutral-900'>your budget, interests, and travel style</span>. From hidden gems to must-visit landmarks, discover your next adventure.
        </p>

        {/* Features - Quick Overview */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-sm'>
          <div className='flex items-center justify-center gap-2 text-neutral-700'>
            <span className='text-2xl'>⚡</span>
            <span className='font-medium'>AI-Powered Plans</span>
          </div>
          <div className='flex items-center justify-center gap-2 text-neutral-700'>
            <span className='text-2xl'>💰</span>
            <span className='font-medium'>Budget Friendly</span>
          </div>
          <div className='flex items-center justify-center gap-2 text-neutral-700'>
            <span className='text-2xl'>⏱️</span>
            <span className='font-medium'>Instant Results</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link to={'/create-trip'}>
          <button className='btn btn-primary text-lg px-8 py-4 hover:shadow-xl'>
            🎯 Plan Your Adventure Now
          </button>
        </Link>

        {/* Social Proof / Stats */}
        <div className='mt-12 text-neutral-500 text-sm'>
          <p>✨ Join thousands of travelers discovering personalized journeys</p>
        </div>
      </div>

      {/* Illustration Area - Subtle gradient accent */}
      <div className='mt-12 md:mt-0 relative w-full max-w-md h-80 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center shadow-2xl'>
        <div className='text-center'>
          <div className='text-7xl mb-4'>🗼🏖️🏔️</div>
          <p className='text-neutral-600 font-medium'>Endless Possibilities Await</p>
        </div>
      </div>
    </div>
  )
}

export default Hero
